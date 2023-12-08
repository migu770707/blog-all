const JWT = require("jsonwebtoken");
const User = require("../models/user");
//クライアントから渡されたJWTが正常か検証
const tokenDecode = (req) => {
  const bearerHeader = req.headers["authorization"];
  console.log("authorizationは以下です");
  console.log(bearerHeader);
  if (bearerHeader) {
    // AuthorizationヘッダーからBearerトークンを取得
    const bearer = bearerHeader.split(" ")[1];
    try {
      // トークンを検証してデコード
      const decodedToken = JWT.verify(bearer, process.env.TOKEN_SECRET_KEY);
      return decodedToken;
    } catch (err) {
      console.error("トークンの検証に失敗しました", err);
      return false;
    }
  } else {
    // Authorizationヘッダーが存在しない場合
    console.error("Authorizationヘッダーが見つかりません");
    return false;
  }
};

//JWT認証を検証するためのミドルウェア
exports.verifyToken = async (req, res, next) => {
  const tokenDecoded = tokenDecode(req);

  if (tokenDecoded) {
    //そのJWTと一致するユーザーを探してくる
    const user = await User.findById(tokenDecoded.id).select("+password");
    console.log("user", user);

    if (!user) {
      return res.status(401).json("権限がありませんよ");
    }
    req.user = user;
    next();
  } else {
    return res.status(401).json("権限がありませんよう");
  }
};
