//バリデーションチェック　　エラーが検出された時にエラー文を返す
const { validationResult } = require("express-validator");
(req, res, next) => {
  const errors = validationResult(req);
  //emptyじゃない時に以下をreturn
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
},
  (exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    //emptyじゃない時に以下をreturn
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  });
