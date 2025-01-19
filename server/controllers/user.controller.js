import sendEmail from "../config/sendEmail.js";
import UserModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
export async function registerUserController(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "provide email, name and password",
        error: true,
        success: false,
      });
    }
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(409).json({
        message: "already registered email",
        error: true,
        success: false,
      });
    }
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    const payload = {
      name,
      email,
      password: hashPassword,
    };
    const newUser = new UserModel(payload);
    const save = await newUser.save();
    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save._id}`;
    const verificationEmail = await sendEmail({
      sendTo: email,
      subject: "Verification email",
      html: verifyEmailTemplate({
        name,
        url: verifyEmailUrl,
      }),
    });

    return res.json({
      message: "user registerd successfully",
      error: false,
      success: true,
      data: save,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
}

export async function verifyEmailController(req, res) {
  try {
    const { code } = req.body;
    console.log("code: " + code);

    const user = await UserModel.findOne({ _id: code });
    if (!user) {
      return res.status(400).json({
        message: "Invalid Code",
        error: true,
        success: false,
      });
    }
    const updateUser = await UserModel.updateOne(
      { _id: code },
      {
        verify_email: true,
      }
    );
    return response.json({
      message: "Verified email",
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: true,
    });
  }
}

export async function loginController(req, res) {
  try {
    const { email, password } = req.body;
    // if (!email || !password) {
    //   return res.json({
    //     message: "Please enter your email and password",
    //     error: true,
    //     success: false,
    //   });
    // }
    const user = await UserModel.findOne({
      email,
    });
    if (!email) {
      return res.status(400).json({
        message: "Invalid email or password",
        error: true,
        success: false,
      });
    }
    if (user.status !== "Active") {
      return res.status(400).json({
        message:
          "Please contact the customer care, Your account is currently inactive",
        error: true,
        success: false,
      });
    }
    const checkPassword = await bcryptjs.compare(password, user.password);
    if (!checkPassword) {
      return status(400).json({
        message: "Invlaid password",
        error: true,
        success: false,
      });
    }
    const accessToken = await generateAccessToken(user._id);
    const refrehToken = await generateRefreshToken(user._id);
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
