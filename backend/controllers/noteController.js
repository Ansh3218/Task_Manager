import noteModel from "../models/noteModel.js";
import { noteValidation } from "../validation/note.js";

export const createNote = async (req, res) => {
  try {
    console.log("Incoming Note Body:", req.body); // 👈 Check kya aa raha hai
    const { error } = noteValidation.validate(req.body);
    if (error) {
      console.log("Validation Error:", error.message); // 👈 Dekho kya issue hai
      return res.status(400).json({ message: error.message });
    }

    const note = new noteModel({
      userId: req.user.id,
      title: req.body.title,
      description: req.body.description,
    });

    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (error) {
    console.log("Server Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getNotes = async (req, res) => {
  try {
    const notes = await noteModel.find({ userId: req.user.id });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const note = await noteModel.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
