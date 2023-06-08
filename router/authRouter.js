var express = require("express");
var router = express.Router();
const {
  signout,
  signUp,
  signIn,
  isSignedIn,
} = require("../controllers/authController");
const { signUp } = require("../controllers/userController");

router.post("/signup", signUp);

router.post("/signIn", signIn);

router.get("/signout", signout);

module.exports = router;
