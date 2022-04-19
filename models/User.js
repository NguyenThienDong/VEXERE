const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    provider: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    username: {
      type: String,
      trim: true, 
      default: null,
    },
    password: {
      type: String,
      trim: true,
      default: null,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email không hợp lệ");
        }
      },
    },
    gender: {
      type: String,
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      default: "user",
    },
    avatar: {
      type: String,
      default: "",
    },
    tokens: {
      type: [String],
      default: [],
    },
    secretToken: {
      type: String,
    },
    verify: {
      type: String,
      default: "notActive",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("users", userSchema);
