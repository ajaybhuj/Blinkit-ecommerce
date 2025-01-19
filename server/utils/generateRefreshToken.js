import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";

const generateRefreshToken = async (userId) => {
  const token = await jwt.sign(
    { id: userid },
    process.env.SECRET_KEY_REFRESH_TOKEN,
    { expiresIn: "7d" }
  );
  const updateRefreshToken = await UserModel.updateOne(
    { _id: userId },
    { refreshToken: token }
  );
  return token;
};

export default generateRefreshToken;
