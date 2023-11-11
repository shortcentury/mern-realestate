import express from "express";
import {
  google,
  signinUser,
  signoutUser,
  signupUser,
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/signup", signupUser);
authRouter.post("/signin", signinUser);
authRouter.post("/google", google);
authRouter.get("/signout", signoutUser);

export default authRouter;
