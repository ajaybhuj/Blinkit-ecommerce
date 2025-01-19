import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    const token =
      req.cookies.accessToken || req?.header?.authorization?.split(" ")[1];
    console.log("token", token);
    if (!token) {
      return res.status(401).json({
        message: "provide token",
      });
    }
    const decode = await jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
    if (!decode) {
      return res.status(401).json({
        message: "unthorize access token",
        error: true,
        success: false,
      });
    }
    req.userId = decode.id;
    next();
  } catch (error) {
    return res.status(400).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export default auth;
