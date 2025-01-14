const { signUp, login } = require("../controller/authController");
const router = require("express").Router();
router.route("/login").post(login);
router.route("/signUp").post(signUp);

module.exports = router;
