import jwt from "jsonwebtoken";
import { appConfig } from "../config/app-config";

const generateToken = (token: { id: number; role: string }) => {
  return jwt.sign({ token }, appConfig.jwtSecret, {
    expiresIn: "1d",
  });
};

const tokenVerification = (token: string) => {
  const verifyToken = token.split(" ")[1];
  return verifyToken;
};

export { generateToken, tokenVerification };
