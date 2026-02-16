const prepareCatergoryData = (category) => {
    const { name, description, isActive, topics } = category;
    const data = { name, description, isActive };
    if (topics) data.topics = topics;
    return data;
}
const validateCategoryData = (categoryData) => {
    const errors = [];
    if (!categoryData.name || categoryData.name.trim().length < 3) {
        errors.push({ msg: "Category name must be at least 3 characters long", param: "name" });
    }
    if (!categoryData.description || categoryData.description.trim().length < 5) {
        errors.push({ msg: "Category description must be at least 5 characters long", param: "description" });
    }
    if (categoryData.isActive !== undefined && typeof categoryData.isActive !== "boolean") {
        errors.push({ msg: "Category isActive must be a boolean", param: "isActive" });
    }
    if (categoryData.topics !== undefined && !Array.isArray(categoryData.topics)) {
        errors.push({ msg: "Category topics must be an array", param: "topics" });
    }
    return errors;
}

module.exports = { prepareCatergoryData, validateCategoryData };