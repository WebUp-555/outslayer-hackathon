import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateToken } from "../utils/token.js";



export const registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password required");
  }

  const exists = await User.findOne({ email });
  if (exists) {
    throw new ApiError(409, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashedPassword,
  });

  return res.status(201).json(
    new ApiResponse(201, {
      userId: user._id,
    }, "Registered successfully")
  );
});


export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = generateToken(user._id);

  return res.status(200).json(
    new ApiResponse(200, { token }, "Login successful")
  );
});

export const logoutUser = asyncHandler(async (req, res) => {
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});