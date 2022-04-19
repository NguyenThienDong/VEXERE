const express = require("express");
const {
  postSignIn,
  postSignUp,
  postVerifyAccount,
} = require("../controllers/user");
const router = express.Router();
const passport = require("passport");

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

router.post("/signup", postSignUp);
router.post("/signin", postSignIn);
router.get("/verify", postVerifyAccount);

module.exports = router;
