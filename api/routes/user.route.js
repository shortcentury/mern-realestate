import express from "express";
import {
  test,
  deleteUser,
  getUserListings,
  updateUser,
  getUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verify.user.js";

const userRouter = express.Router();

userRouter.get("/test/", test);
userRouter.post("/update/:id", verifyToken, updateUser);
userRouter.delete("/delete/:id", verifyToken, deleteUser);
userRouter.get("/listings/:id", verifyToken, getUserListings);
userRouter.get("/:id", verifyToken, getUser);

export default userRouter;
