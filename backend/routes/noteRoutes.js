import express from "express";
import {
  createNote,
  getNotes,
  deleteNote,
} from "../controllers/noteController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const noteRoutes = express.Router();

noteRoutes.post("/create", authMiddleware, createNote);
noteRoutes.get("/", authMiddleware, getNotes);
noteRoutes.delete("/:id", authMiddleware, deleteNote);

export default noteRoutes;
