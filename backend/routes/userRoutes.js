import express from "express";
import {
  SignUpUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const userRoutes = express.Router();

userRoutes.post("/signup", SignUpUser);
userRoutes.post("/login", loginUser);

userRoutes.get("/profile", authMiddleware, getUserProfile);
userRoutes.put("/update", authMiddleware, updateUserProfile);
userRoutes.delete("/delete", authMiddleware, deleteUserAccount);

export default userRoutes;
