const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10; //salt가 몇글자인지를 나타냄
const jwt = require("jsonwebtoken");
const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true, //공백제거
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    //유효기간
    type: Number,
  },
});

userSchema.pre("save", function (next) {
  var user = this; //userSchema를 가리킴
  if (user.isModified("password")) {
    // 비밀번호 암호화 - 비크립트(노드js 라이브러리 Bcrypt를 활용) https://www.npmjs.com/package/bcrypt
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash; //성공하면 패스워드를 해시된 비밀번호로 변경해줌
        next();
      });
    });
  } else {
    // 비밀번호가 아닌 다른 것을 변경할 경우는 넘어감
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  //plainPassword: 1234567
  //암호화된 비밀번호: $2b$10$iS/.4JafqcBGfkP7hgD3denUCLeO5b82NuCwU7l4nMneg0/vKZ16.
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  var user = this;
  // jsonwebtoken을 이용해서 token 생성하기
  var token = jwt.sign(user._id.toHexString(), "secretToken");
  // ENCODE : user._id + 'scretToken' = token
  // ->
  // DECODE : 'scretToken' -> user._id
  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

userSchema.statics.findByToken = function(token, cb) {
  var user = this;
  // user._id + '' = token
  // token을 Decode한다. (jsonwebtoken 라이브러리)
  jwt.verify(token, "secretToken", function (err, decoded) {
    // user id를 이용해서 유저를 찾은 다음
    // client에서 가져온 token과 DB에 보관된 token이 일치하는지 확인
    user.findOne({ "_id": decoded, "token": token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

const User = mongoose.model("User", userSchema);
module.exports = { User };
