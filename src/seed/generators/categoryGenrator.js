const { faker } = require("@faker-js/faker");

const Category = require("../../models/Category");
const { generateCategory } = require("../fackerUtils");
 

exports.seedCategories = async (count = 10) => {
  const categories = Array.from({ length: count }, () => generateCategory());
  await Category.insertMany(categories);
  console.log(`✅ Seeded ${count} categories successfully!`);
};