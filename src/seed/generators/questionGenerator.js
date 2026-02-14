const { faker } = require("@faker-js/faker");

exports.generateQuestions = (courseIds, userIds, count = 100) => {
  if (!courseIds.length || !userIds.length) return [];

  const difficulties = ["easy", "medium", "hard"];

  return Array.from({ length: count }, () => {
    const options = Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, (_, i) => ({
      text: faker.lorem.words(3),
      image: faker.datatype.boolean() ? faker.image.urlPicsumPhotos() : "",
      isCorrect: i === 0,
    }));

    return {
      courseId: faker.helpers.arrayElement(courseIds),
      userId: faker.helpers.arrayElement(userIds),
      questionText: faker.lorem.sentence(),
      questionImage: faker.datatype.boolean() ? faker.image.urlPicsumPhotos() : "",
      options,
      explanation: {
        text: faker.lorem.sentence(),
        image: faker.datatype.boolean() ? faker.image.urlPicsumPhotos() : "",
      },
      difficulty: faker.helpers.arrayElement(difficulties),
      marks: faker.number.int({ min: 1, max: 5 }),
      negativeMarks: faker.number.int({ min: 0, max: 2 }),
      tags: faker.helpers.arrayElements(
        ["math", "science", "history", "react", "nodejs", "mongo", "css", "html"],
        faker.number.int({ min: 1, max: 3 })
      ),
      active: faker.datatype.boolean(),
    };
  });
};
