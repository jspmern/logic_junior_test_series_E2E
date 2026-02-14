const { faker } = require("@faker-js/faker");
const slugify = require("slugify");

// ✅ Generate a random, unique category
exports.generateCategory = () => {
  // generate safe name and ensure it’s always unique
  const rawName = faker.commerce.department() || faker.word.sample() || "Category";
  const uniqueSuffix = faker.string.alphanumeric(5).toUpperCase();
  const name = `${rawName} ${uniqueSuffix}`.trim();

  // always create a unique slug
  const slug = slugify(name, { lower: true, strict: true });

  return {
    name,
    slug,
    description: faker.commerce.productDescription(),
    isActive: faker.datatype.boolean(),
  };
};
