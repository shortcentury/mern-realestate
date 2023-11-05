import express from "express";
import { signinUser } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.use("/signin", signinUser);

export default userRouter;
