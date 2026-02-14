const { validationResult } = require("express-validator");
const Category = require("../models/Category");
const { prepareCatergoryData, validateCategoryData } = require("../utilis/categoryUtils");

const getAllCategoriesHandler=async(req,res,next)=>{
    try{
        const categories=await Category.find({});
        res.status(200).json({success:true,message:"All categories fetched successfully",data:categories,total:categories.length})
    }catch(err){
        return next(err);
    }
}
const createCategoryHandler=async(req,res,next)=>{
    try{
      const errors = validationResult(req);
        if (!errors.isEmpty()) {
          const error = new Error("Validation failed");
          error.status = 400;
          error.errors = errors.array();
          return next(error);
        }
        const categoryData = prepareCatergoryData(req.body);
         const additionalErrors = validateCategoryData(categoryData);
            if (additionalErrors.length > 0) {
              const error = new Error("Validation failed");
              error.status = 400;
              error.errors = additionalErrors;
              return next(error);
            }
        const category = new Category(categoryData);
        await category.save();
        res.status(201).json({success:true,message:"Category created successfully",data:category});
    }
    catch(err){
        return next(err);
    }
}
const updateCategoryHandler=async(req,res,next)=>{
    try{
        const errors=validationResult(req)
        if(!errors.isEmpty()){
            const error=new Error("validation faliled")
            error.status=400;
            error.errors=errors.array();
            return next(error);
        }
        const cat_id=req.params.id;
      const categoryData=prepareCatergoryData(req.body);
      const additionalErrors=validateCategoryData(categoryData);
      if (additionalErrors.length > 0) {
          const error = new Error("Validation failed");
          error.status = 400;
          error.errors = additionalErrors;
          return next(error);
      }
      
      if (categoryData.name) {
          categoryData.slug = categoryData.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
      }
      
      let updateCategoryData=await Category.findByIdAndUpdate(cat_id,{$set:categoryData},{new:true});
        if(!updateCategoryData){
            const error=new Error("Category not found");
            error.status=404;
            return next(error);
        }
        res.status(200).json({success:true,message:"Category updated successfully",data:updateCategoryData});
    }
    catch(err){
        return next(err)
    }
}
const deleteCategoryHandler=async(req,res,next)=>{
    try{
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            const error=new Error('validation failed');
            error.status=400;
            error.errors=errors.array();
            return next(error);
        }
        const cat_id=req.params.id;
        const deletedCategory=await Category.findByIdAndDelete(cat_id);
        if(!deletedCategory){
            const error=new Error("Category not found");
            error.status=404;
            return next(error);
        }
        res.status(200).json({success:true,message:"Category deleted successfully",data:deletedCategory});
    }
    catch(err){
        return next (err)
    }
}
module.exports={getAllCategoriesHandler,createCategoryHandler,updateCategoryHandler,deleteCategoryHandler}