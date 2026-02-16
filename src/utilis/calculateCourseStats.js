const Course = require("../models/Course");
const Question = require("../models/Question");

const recalculateCourseStats = async (courseId) => {
    try {
        const questions = await Question.find({ courseId });
        // Calculate total marks based on sum of question marks
        const totalMarks = questions.reduce((sum, q) => sum + (q.marks || 1), 0);

        // We only update totalMarks. totalQuestions should be manually set as the test limit.
        await Course.findByIdAndUpdate(courseId, {
            totalMarks
        });
        console.log(`Updated stats for course ${courseId}: Total Marks calculated as ${totalMarks}`);
    } catch (error) {
        console.error(`Failed to update stats for course ${courseId}:`, error);
    }
};

module.exports = { recalculateCourseStats };
