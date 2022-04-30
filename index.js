const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const config = require("./config/key");
const { User } = require("./models/User");
const mongoose = require("mongoose");

// application/x-ww-from-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//application/json
app.use(bodyParser.json());

mongoose
  .connect(config.mongoURI, {
    //6.0 이후부터는 아래 옵션이 기본으로 적용되므로 삭제하거나 주석처리해야 정상적으로 실행
    //useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex: true,useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!~~ 안녕하세요~");
});

app.post("/register", (req, res) => {
  //회원가입에 필요한 정보들을 clinet에서 가져오면
  //그것들을 데이터 베이스에 넣어준다.

  const user = new User(req.body);
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
