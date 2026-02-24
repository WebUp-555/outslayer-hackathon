import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

const getJwtSecret = () => process.env.JWT_SECRET || process.env.ACCESS_TOKEN_SECRET;

export const verifyJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ msg: "No token" });

  const secret = getJwtSecret();
  if (!secret) {
    return next(new ApiError(500, "JWT secret is not configured"));
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch {
    return next(new ApiError(401, "Invalid or expired token"));
  }
  
};