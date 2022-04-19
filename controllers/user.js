const User = require("../models/User");
const jwt = require("jsonwebtoken");
const config = require("config");
const jwtSignature = config.get("jwtSignature");
const randomstring = require("randomstring");
const bcryptjs = require("bcryptjs");

const postSignUp = async (req, res) => {
  try {
    const { name, username, password, email, gender, phone } = req.body;
    // validate
    if (!name || !username || !password || !email || !phone || !gender) {
      return res
        .status(401)
        .send({ message: "Vui lòng nhập đầy đủ thông tin!!" });
    }
    if (password.length < 6) {
      return res.status(401).send({ message: "Password có ít nhất 6 ký tự" });
    }
    if (password.length > 16) {
      return res
        .status(401)
        .send({ message: "Password không được vượt quá 16 ký tự" });
    }
    // Kiểm tra xem tài khoản đã tồn tại chưa
    const foundedUser = await User.findOne().or([
      { username },
      { email, provider: "" },
    ]);
    if (foundedUser) {
      return res.status(401).send({ message: "Tài khoản đã tồn tại" });
    }
    const secretToken = randomstring.generate() + Date.now();
    const newUser = new User({
      name,
      username,
      password,
      email,
      gender,
      phone,
      avatar: "/images/default-avatar.png",
      role: "user",
      secretToken,
    });
    const result = await newUser.save();
    res.send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "You are not authorized" });
  }
};

const postSignIn = async (req, res) => {
  const { username, password } = req.body;
  try {
    const foundedUser = await User.findOne({ username });
    if (!foundedUser) {
      return res
        .status(401)
        .send({ message: "Tài khoản or mật khẩu không đúng" });
    }
    if (foundedUser.verify === "notActive") {
      return res.status(401).send({ message: "Vui lòng xác nhận email!..." });
    }
    const isMatchPassword = await bcryptjs.compare(
      password,
      foundedUser.password
    );
    if (!isMatchPassword)
      return res
        .status(401)
        .send({ message: "Tài khoản hoặc mật khẩu ko đúng!!" });
    const token = await jwt.sign(
      {
        _id: foundedUser._id,
      },
      jwtSignature,
      { expiresIn: "30m" }
    );
    foundedUser.tokens.push(token);
    await foundedUser.save();
    res.send(token);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "You are not authorized" });
  }
};

const postVerifyAccount = async (req, res) => {
  const { secretToken } = req.query;
  try {
    const founderUser = await User.findOne({ secretToken });
    founderUser.verify = "active";
    founderUser.secretToken = "";
    founderUser.save();
    res.status(200).send({ message: "Active tài khoản thành công!!" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "You are not authorized" });
  }
};

const postLogout = async (req, res) => {
  try {
    const index = req.user.tokens.findIndex((token) => token === req.token);
    req.user.tokens.splice(index, 1);
    await req.user.save();
    res.status(200).send({ message: "Đăng xuất thành công!!" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "You are not authorized" });
  }
};

const postForgetPassword = async (req, res) => {
  const { email } = req.query;
  try {
    const foundedUser = await User.findOne({ provider: "", email });
    if (!foundedUser)
      return res.status(401).send({ message: "Email ko tồn tại" });
    const secretToken = randomstring.generate() + Date.now();
    foundedUser.secretToken = secretToken;
    const contentEmai = {
      html: `<h3>Đây là mã reset mật khẩu của ban:</h3>
          <p>mã reset passworrd:${secretToken}</p>`,
      subject: "Reset mật khẩu VexereCuoiKhoa",
    };
    await foundedUser.save();
    await sendEmail(email, contentEmai);
    res.status(200).send({ message: "Vui lòng check email!!" });
  } catch (err) {
    res.status(500).send({ message: "You are not authorized" });
  }
};

const checkSecretTokenResetPassword = async (req, res) => {
  const { secretToken, email } = req.body;
  try {
    const foundedUser = await User.findOne({ provider: "", email });
    if (!foundedUser)
      return res.status(401).send({ message: "Email không tồn tại!!" });
    if (foundedUser.secretToken !== secretToken)
      return res.status(401).send({ message: "Mã xác nhận ko đúng!!" });
    res.status(200).send({ message: "Successs" });
  } catch (err) {
    res.status(500).send({ message: "You are not authorized" });
  }
};

const postResetPass = async (req, res) => {
  const { email, password, secretToken } = req.body;
  console.log(email, password, secretToken);
  try {
    const foundedUser = await User.findOne({ provider: "", email });
    if (!foundedUser)
      return res.status(401).send({ message: "Email không tồn tại!!" });
    if (foundedUser.secretToken !== secretToken)
      return res.status(401).send({ message: "Mã xác nhận ko đúng!!" });
    foundedUser.password = password;
    foundedUser.secretToken = "";
    await foundedUser.save();
    res.status(200).send({ message: "Thay đổi password thành công!!!" });
  } catch (err) {
    res.status(500).send({ message: "You are not authorized" });
  }
};

module.exports = {
  postSignUp,
  postSignIn,
  postVerifyAccount,
  postLogout,
  postForgetPassword,
  checkSecretTokenResetPassword,
  postResetPass,
};
