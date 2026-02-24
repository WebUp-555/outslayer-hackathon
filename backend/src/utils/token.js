import jwt from "jsonwebtoken";
import { ApiError } from "./ApiError.js";

const getJwtSecret = () => process.env.JWT_SECRET || process.env.ACCESS_TOKEN_SECRET;

export const generateToken = (userId) => {
  const secret = getJwtSecret();
  if (!secret) {
    throw new ApiError(500, "JWT secret is not configured");
  }

  return jwt.sign(
    { id: userId },
    secret,
    { expiresIn: "1d" }
  );
};