const express = require("express");
const app = express();
const port = 5000;
const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://khakhid:tlsehd52!@boilerplate.h8ybc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
      //6.0 이후부터는 아래 옵션이 기본으로 적용되므로 삭제하거나 주석처리해야 정상적으로 실행
      //useNewUrlParser: true,
      //useUnifiedTopology: true,
      //useCreateIndex: true,
      //useFindAndModify: false,
    }
  )
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!~~ 안녕하세요~");
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
