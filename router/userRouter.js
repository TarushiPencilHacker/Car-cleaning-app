var express = require("express");
const router = require("express").Router();
const { signUp, verifyOtp } = require("../controllers/userController");

const {
  getUserByID,
  getUser,
  updateUser,
} = require("../controllers/userController");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");

router.param("userId", getUserByID);
router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);

router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);

router.route("/signup").post(signUp);
router.route("/signup/verify").post(verifyOtp);

module.exports = router;
