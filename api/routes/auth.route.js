import express from "express";
import { signupUser } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/signup", signupUser);

export default authRouter;
