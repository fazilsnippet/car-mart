import {OTP} from "../models/Otp.model.js"
import { User } from '../models/User.model.js';
import { sendEmail } from "../utils/sendEmail.js";
import { createOtp } from "../utils/generateOtp.js";


export const sendSignupOtp = async (
  req,
  res
) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const otpCode = await createOtp({
      email,
      purpose: "signup",
      expiryMinutes: 5,
    });

    await sendEmail({
      to: email,

      subject: "Signup OTP",

      text: `Your OTP is ${otpCode}`,

      html: `
        <div style="font-family:sans-serif;">
          <h2>Car Mart OTP</h2>

          <p>Your OTP code is:</p>

          <h1
            style="
              letter-spacing:4px;
              color:#2563eb;
            "
          >
            ${otpCode}
          </h1>

          <p>
            This OTP expires in 5
            minutes.
          </p>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message:
        "OTP sent for registration",
    });
  } catch (err) {
    console.error(
      "Signup OTP Error:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        err.message ||
        "Failed to send OTP",
    });
  }
};


export const verifySignupOtp = async (
  req,
  res
) => {
  try {
    let { email, otp, password } =
      req.body;

    if (
      !email ||
      !otp ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Email, OTP and password are required",
      });
    }

    email = email
      .trim()
      .toLowerCase();

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "User already exists",
      });
    }

    const otpRecord =
      await OTP.findOne({
        email,
        otp,
        purpose: "signup",
      });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (
      otpRecord.expiresAt <
      new Date()
    ) {
      await OTP.deleteMany({
        email,
        purpose: "signup",
      });

      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    const user = await User.create({
      email,
      password,
    });

    await OTP.deleteMany({
      email,
      purpose: "signup",
    });

    return res.status(201).json({
      success: true,
      message:
        "Registration successful",

      user: {
        _id: user._id,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(
      "Verify Signup OTP Error:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        err.message ||
        "Registration failed",
    });
  }
};

export const sendForgotPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    // ✅ Correct usage with purpose
    const otpCode = await createOtp({
      email,
      purpose: "forgotPassword",
      expiryMinutes: 5,
    });

   
    await sendEmail({
  to: email,
  subject: "forgot password OTP",
  text: `Your OTP is ${otpCode}`,
});

    res.json({ message: "OTP sent for password reset" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const otpRecord = await OTP.findOne({
      email,
      purpose: "forgotPassword",
    });

    if (!otpRecord)
      return res.status(400).json({ message: "Invalid OTP" });

    if (otpRecord.expiresAt < new Date())
      return res.status(400).json({ message: "OTP expired" });

    const isMatch = otpRecord.compareOtp(otp);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid OTP" });

    await OTP.findOneAndDelete({
      email,
      purpose: "forgotPassword",
    });

    const user = await User.findOne({ email });
    user.password = newPassword;
    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const sendUpdatePasswordOtp = async (req, res) => {
  try {
    const email = req.user.email;

    const otpCode = await createOtp({
      email,
      purpose: "updatePassword",
      expiryMinutes: 5,
    });

   
    await sendEmail({
  to: email,
  subject: "Password Update OTP",
  text: `Your OTP is ${otpCode}`,
});

    res.json({ message: "OTP sent for password update" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const updatePasswordAfterLogin = async (req, res) => {
  try {
    const email = req.user.email;
    const { otp, newPassword } = req.body;

    const otpRecord = await OTP.findOne({
      email,
      purpose: "updatePassword",
    });

    if (!otpRecord)
      return res.status(400).json({ message: "Invalid OTP" });

    if (otpRecord.expiresAt < new Date())
      return res.status(400).json({ message: "OTP expired" });

    const isMatch = otpRecord.compareOtp(otp);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid OTP" });

    await OTP.findOneAndDelete({
      email,
      purpose: "updatePassword",
    });

    const user = await User.findOne({ email });
    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};