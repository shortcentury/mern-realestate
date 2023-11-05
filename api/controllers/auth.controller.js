import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import { errorHandler } from "../utils/error.js";

dotenv.config();

export const signupUser = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 12);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json("User Created!");
  } catch (error) {
    next(errorHandler(550, "Error from signUp function!"));
    // res.status(500).json(error.message);
  }
};
