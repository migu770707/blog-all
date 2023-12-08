const router = require("express").Router();
const { body } = require("express-validator");

const User = require("../models/user");
const validation = require("../handlers/validation");
const userController = require("../controlleres/users");
const tokenHandler = require("../handlers/tokenHandler");

//http://localhost:3000/api/v1/auth/register    index.jsみて！！！

//ユーザー新規登録API
router.post(
  "/register",
  body("username")
    .isLength({ min: 8 })
    .withMessage("ユーザー名は8文字以上である必要があります"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("パスワードは8文字以上である必要があります"),
  body("confirmPassword")
    .isLength({ min: 8 })
    .withMessage("確認用パスワードは8文字以上である必要があります"),
  body("username").custom((value) => {
    return User.findOne({ username: value }).then((user) => {
      if (user) {
        return Promise.reject("このユーザーはすでに使われています");
      }
    });
  }),

  //パスワードの受け取りの前にバリデーと関数を呼んであげる
  validation.validate,
  userController.register
);
// const DUPLICATED_ENTITY_ERROR_CODE = 11000;
//ログイン用API
router.post(
  "/login",
  body("username")
    .isLength({ min: 8 })
    .withMessage("ユーザー名は8文字以上である必要があります"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("パスワードは8文字以上である必要があります"),
  validation.validate,
  userController.login
);

// JWT認証API
//JWT認証APIのエンドポイント/verify-tokenが呼ばれた時に順番にミドルウェアが呼ばれてnextにぶち当たったら3番目が実行
router.post("/verify-token", tokenHandler.verifyToken, (req, res) => {
  res.status(200).json({ user: req.user });
});

module.exports = router;
