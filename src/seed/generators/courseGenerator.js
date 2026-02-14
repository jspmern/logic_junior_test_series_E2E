const { faker } = require("@faker-js/faker");

exports.generateCourses = (categoryIds, userIds, count = 10) => {
  if (!categoryIds.length || !userIds.length) return [];

  return Array.from({ length: count }, () => ({
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    thumbnail: faker.image.urlPicsumPhotos(),
    category: [faker.helpers.arrayElement(categoryIds)], // ✅ matches your schema
    isPaid: faker.datatype.boolean(),
    price: faker.number.int({ min: 0, max: 999 }),
    duration: `${faker.number.int({ min: 1, max: 12 })} weeks`,
    totalMarks: faker.number.int({ min: 50, max: 500 }),
    totalQuestions: faker.number.int({ min: 10, max: 100 }),
    isPublished: faker.datatype.boolean(),
    author: faker.helpers.arrayElement(userIds),
  }));
};
