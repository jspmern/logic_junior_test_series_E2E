const prepareCatergoryData = (category) => {
    const {name,description,isActive}=category;
    return {name,description,isActive};
}
const validateCategoryData=(categoryData)=>{
    const errors=[];
    if(!categoryData.name || categoryData.name.trim().length<3){
        errors.push({msg:"Category name must be at least 3 characters long",param:"name"});
    }
    if(!categoryData.description || categoryData.description.trim().length<5){
        errors.push({msg:"Category description must be at least 5 characters long",param:"description"});
    }
    if(categoryData.isActive !== undefined && typeof categoryData.isActive !== "boolean"){
        errors.push({msg:"Category isActive must be a boolean",param:"isActive"});
    }
    return errors;
}

module.exports = { prepareCatergoryData, validateCategoryData};