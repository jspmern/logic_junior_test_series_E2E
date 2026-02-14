const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  text: { type: String, trim: true },
  image: { type: String, trim: true },
  isCorrect: { type: Boolean, default: false },
});

const questionSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    userId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    questionText: { type: String, trim: true },
    questionImage: { type: String, trim: true }, // optional
    options: {
      type: [optionSchema],
      validate: {
        validator: (v) => v.length >= 2 && v.length <= 6,
        message: "Question must have 2–6 options",
      },
    },
    explanation: {
      text: { type: String, trim: true },
      image: { type: String, trim: true },
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },
    marks: { type: Number, default: 1 },
    negativeMarks: { type: Number, default: 0 },
    tags: [{ type: String, trim: true }],
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);
questionSchema.index({ courseId: 1 });
questionSchema.index({ difficulty: 1 });

module.exports = mongoose.model("Question", questionSchema);
