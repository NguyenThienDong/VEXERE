const express = require("express");
const {
  postSignIn,
  postSignUp,
  postVerifyAccount,
  postLogout,
  postForgetPassword,
  checkSecretTokenResetPassword,
  postResetPass,
  getProfile,
  putProfile,
  putProfileAvatar,
  checkAdmin,
} = require("../controllers/user");
const { upload } = require("../multer");
const auth = require("../helpers/authorization");
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
router.post("/logout", auth(), postLogout);
router.post("/forgetpassword", postForgetPassword);
router.post("/checksecrettoken", checkSecretTokenResetPassword);
router.post("/resetpassword", postResetPass);
router.get("/profile", auth(), getProfile);
router.put("/profile", auth(), upload.single("avatar"), putProfile);
router.put(
  "/profile/avatar",
  auth(),
  upload.single("avatar"),
  putProfileAvatar
);
router.post("/admin", auth(["admin"]), checkAdmin);

module.exports = router;
