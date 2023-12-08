//新規登録用のコントローラー

const CryptoJS = require("crypto-js");
const JWT = require("jsonwebtoken");
const User = require("../models/user");

exports.register = async (req, res) => {
  //パスワードの受け取り

  const password = req.body.password;
  console.log("Received password:", password);

  try {
    //パスワードの暗号化
    req.body.password = CryptoJS.AES.encrypt(password, process.env.SECRET_KEY);
    //ユーザーの新規作成

    const user = await User.create(req.body);
    console.log("ユーザー名を生成しました");
    console.log("Received user:", user);

    //JWTの発行 トークンの発行
    const token = JWT.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, {
      expiresIn: "24h",
    });
    console.log("トークンを発行しました");
    console.log("Received token:", token);

    return res.status(200).json({ user, token });
  } catch (err) {
    //
    if (err.code === DUPLICATED_ENTITY_ERROR_CODE) {
      return res.status(409).json("データが重複してます。");
    }
    return res.status(500).json(err);
  }
};

//ユーザーログイン用API
exports.login = async (req, res) => {
  //ユーザーがログインするときに打ち込むそのままの文字列を取得。
  const { username, password } = req.body;

  try {
    //DBからユーザーが存在するか探してくる
    const user = await User.findOne({ username: username }).select("+password");
    console.log("ユーザー存在確認成功");
    if (!user) {
      return res.status(401).json({
        errors: [
          {
            param: "username",
            msg: "ユーザー名が無効です",
          },
        ],
      });
    }
    console.log("kokokkoko");

    console.log("user", user);
    console.log("CryptoJS.enc.Utf8", CryptoJS.enc.Utf8);
    //パスワードが合っているか照合する。パスワードを複合する
    const descryptedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.SECRET_KEY
    ).toString(CryptoJS.enc.Utf8);

    if (descryptedPassword !== password) {
      console.log("aaa");

      return res.status(401).json({
        errors: [
          {
            param: "password",
            msg: "ユーザー名かパスワードが無効です",
          },
        ],
      });
    }

    //JWTの発行 トークンの発行
    //サイン関数を使って発行していた
    const token = JWT.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, {
      expiresIn: "24h",
    });

    return res.status(201).json({ user, token });
  } catch (err) {
    console.log("err", err);
    return res.status(500).json({ err });
  }
};
