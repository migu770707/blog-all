const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 8000;
//http://localhost:8000/
require("dotenv").config();
// const cors = require("cors"); // cors モジュールのインポート

// app.use(
//   cors({
//     origin: "http://localhost:3000",
//   })
// );
app.use(express.json());
//ここだ!!!
// app.use("/api/v1", require("./src/v1/routes/auth"));
app.use("/api/v1", require("./src/v1/routes"));
//http://localhost:8000/api/v1/register

//DB接続
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DBに接続しました");
  } catch (error) {
    console.error("DB接続エラーです:", error);
  }
}

connectToDatabase();
// try {
//   mongoose.connect(process.env.MONGODB_URL);
//   console.log("DB接続中");
// } catch (error) {
//   console.log(error);
// }

app.listen(PORT, () => {
  console.log("ローカルサーバー起動中ですよ");
});
