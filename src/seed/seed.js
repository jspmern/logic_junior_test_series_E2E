require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");

const User = require("../models/User");
const Category = require("../models/Category");
const Course = require("../models/Course");
const Question = require("../models/Question");

const { generateUsers } = require("./generators/userGenerator");
const { seedCategories } = require("./generators/categoryGenrator");
const { generateCourses } = require("./generators/courseGenerator");
const { generateQuestions } = require("./generators/questionGenerator");

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected");

    console.log("🧹 Clearing old data...");
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Course.deleteMany({}),
      Question.deleteMany({}),
    ]);

    console.log("👤 Creating fake users...");
    const users = await User.insertMany(generateUsers(15));

    console.log("📚 Creating fake categories...");
    const categories = await Category.insertMany(seedCategories(8));

    console.log("🎓 Creating fake courses...");
    const courses = await Course.insertMany(
      generateCourses(categories.map((c) => c._id), users.map((u) => u._id), 10)
    );

    console.log("❓ Creating fake questions...");
    const questions = await Question.insertMany(
      generateQuestions(courses.map((c) => c._id), users.map((u) => u._id), 200)
    );

    console.log("✅ Seeding complete!");
    console.table({
      Users: users.length,
      Categories: categories.length,
      Courses: courses.length,
      Questions: questions.length,
    });
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  } finally {
    console.log("🔒 Closing DB connection...");
    await mongoose.connection.close();
    console.log("✅ Done!");
  }
};

seedDatabase();
