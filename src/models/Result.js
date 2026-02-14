const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    score: { type: Number, default: 0 },
    totalMarks: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    wrongAnswers: { type: Number, default: 0 },
    attemptedQuestions: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
        selectedOption: { type: mongoose.Schema.Types.ObjectId },
        isCorrect: { type: Boolean },
        marks: { type: Number },
      },
    ],
    timeTaken: { type: Number, default: 0 },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Result", resultSchema);
