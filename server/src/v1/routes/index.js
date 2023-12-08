const router = require("express").Router();

router.use("/auth", require("./auth"));
// router.use("/memo", require("./memo"));

module.exports = router;
//http://localhost:3000/api/v1/auth/registerを可能にする
