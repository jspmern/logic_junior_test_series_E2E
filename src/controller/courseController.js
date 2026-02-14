const { validationResult } = require("express-validator");
const Course = require("../models/Course");
const { validateCourseData, prepareCourseData } = require("../utilis/courseUtils");
const client = require("../config/redisClient");
const { clearCacheByPrefix } = require("../utilis/cacheKey");


const getAllCourseController = async (req, res, next) => {
  try {
    const course = await Course.find({}).populate('category').populate('author', 'firstName email').sort({ createdAt: -1 });
    // Save result to cache (only if cache middleware set the key and client is connected)
    if (res.locals.cacheKey && client.isOpen) {
      try {
        await client.setEx(
          res.locals.cacheKey,
          res.locals.expiry,
          JSON.stringify(course)
        );
        console.log("🗄️ Data saved to Redis cache:", res.locals.cacheKey);
      } catch (err) {
        console.error("Failed to save to cache", err);
      }
    }
    res.status(200).json({ success: true, message: "All courses fetched successfully", data: course, total: course.length })
  }
  catch (error) {
    return next(error);
  }
}
const createCourseController = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.status = 400;
      error.errors = errors.array();
      return next(error);
    }
    const courseData = prepareCourseData(req.body);
    const additionalErrors = validateCourseData(courseData);
    if (additionalErrors.length > 0) {
      const error = new Error("Validation failed");
      error.status = 400;
      error.errors = additionalErrors;
      return next(error);
    }
    const newCourse = new Course(courseData);
    await newCourse.save();
    await clearCacheByPrefix("courses");
    res.status(201).json({ success: true, message: "Course created successfully", data: newCourse });
  }
  catch (error) {
    return next(error);
  }
}
const uploadThumbnailController = async (req, res, next) => {
  //TODO: implement upload logic for cloudary or s3
  try {
    if (!req.file) return res.status(400).json({ message: "Thumbnail is required" });
    const imagePath = `/uploads/courses/${req.file.filename}`;
    const proto = req.get('x-forwarded-proto') || req.protocol;
    const host = req.get('host');
    const fullUrl = `${proto}://${host}${imagePath}`;
    res.status(200).json({ success: true, message: "Thumbnail uploaded successfully", data: { thumbnail: fullUrl } });
  }
  catch (error) {
    return next(error);
  }
}
const getCourseByIdController = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.status = 400;
      error.errors = errors.array();
      return next(error);
    }
    const course = await Course.findById(req.params.id).populate('category').populate('author', 'name email');
    if (!course) {
      const error = new Error("Course not found");
      error.status = 404;
      return next(error);
    }
    res.status(200).json({ success: true, message: "Course fetched successfully", data: course });
  }
  catch (error) {
    return next(error);
  }
}
const updateCourseController = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.status = 400;
      error.errors = errors.array();
      return next(error);
    }
    const courseData = prepareCourseData(req.body);
    const additionalErrors = validateCourseData(courseData);
    if (additionalErrors.length > 0) {
      const error = new Error("Validation failed");
      error.status = 400;
      error.errors = additionalErrors;
      return next(error);
    }
    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, courseData, { new: true });
    if (!updatedCourse) {
      const error = new Error("Course not found");
      error.status = 404;
      return next(error);
    }
    await clearCacheByPrefix("courses");
    res.status(200).json({ success: true, message: "Course updated successfully", data: updatedCourse });
  }
  catch (error) {
    return next(error);
  }
}
const deleteCourseController = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.status = 400;
      error.errors = errors.array();
      return next(error);
    }
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) {
      const error = new Error("Course not found");
      error.status = 404;
      return next(error);
    }
    await clearCacheByPrefix("courses");
    res.status(200).json({ success: true, message: "Course deleted successfully", data: deletedCourse });
  }
  catch (error) {
    return next(error);
  }
}
module.exports = {
  getAllCourseController,
  createCourseController,
  getCourseByIdController,
  updateCourseController,
  deleteCourseController,
  uploadThumbnailController
}
