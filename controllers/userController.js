const bcrypt = require("bcrypt");
const _ = require("lodash");
const axios = require("axios");
const User = require("../models/userModel");
const otpGenerator = require("otp-generator");

const { User } = require("../models/userModel");
const { Otp } = require("../models/otpModel");

module.exports.signUp = async (req, res) => {
  const user = await User.findOne({
    number: req.body.number,
  });
  if (user) return res.status(400).send("User already registered.");
  const OTP = otpGenerator.generate(6, {
    digits: true,
    alphabets: false,
    upperCase: false,
    specialChars: false,
  });
  const number = req.body.number;
  console.log(OTP);

  //SMS gateway documentation required here

  const otp = new Otp({ number: number, otp: OTP });
  const salt = await bcrypt.genSalt(10);
  otp.otp = await bcrypt.hash(otp.otp, salt);
  const result = await otp.save();
  return res.status(200).send("Otp sent successfully!");
};

module.exports.verifyOtp = async (req, res) => {
  const otpHolder = await Otp.find({
    number: req.body.number,
  });
  if (otpHolder.length === 0) return res.status(400).send("Expired OTP.");
  const rightOtpFind = otpHolder(otpHolder.length - 1);
  const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp);

  if (rightOtpFind.number == req.body.number && validUser) {
    const user = new User(_.pick(req.body, ["number"]));
    const token = user.generateJWT();
    const result = await user.save();
    const OTPDelete = await Otp.deleteMany({
      number: rightOtpFind.number,
    });
    return res.status(200).send({
      message: "User Registration Successfull!",
      token: token,
      data: result,
    });
  } else {
    return res.status(400).send("Wrong OTP");
  }
};


exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(403).json({
        error: "USER NOT FIND",
      });
    }
    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  req.profile.createdAt = undefined;
  req.profile.updatedAt = undefined;

  return res.json(req.profile);
};

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err) => {
      if (err) {
        return res.status(400).json({
          error: "You are not authorized to Update",
        });
      }
      user.salt = undefined;
      user.encry_password = undefined;
      res.json(user);
    }
  );
};