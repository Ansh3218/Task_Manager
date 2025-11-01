import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, trim: true, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Note", noteSchema);
