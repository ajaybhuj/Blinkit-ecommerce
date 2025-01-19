import jwt from "jsonwebtoken";

const generateAccessToken = async (userid) => {
  const token = await jwt.sign(
    { id: userid },
    process.env.SECRET_KEY_ACCESS_TOKEN,
    { expiresIn: "5h" }
  );
  return token;
};

export default generateAccessToken;
