const { faker } = require("@faker-js/faker");
const bcrypt = require("bcryptjs");
// 💡 Login password for all non-Google users = Password@123

exports.generateUsers = (count = 15) => {
  return Array.from({ length: count }, () => {
    const isGoogle = faker.datatype.boolean();
    const password = isGoogle ? undefined : bcrypt.hashSync("Password@123", 10); // consistent password

    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      middleName: faker.person.middleName(),
      age: faker.number.int({ min: 18, max: 60 }),
      email: faker.internet.email().toLowerCase(),
      password,
      gender: faker.helpers.arrayElement(["male", "female", "other"]),
      isPremium: faker.datatype.boolean(),
      about: faker.lorem.sentence(),
      hobbies: faker.helpers.arrayElements(
        ["reading", "coding", "sports", "gaming", "music", "traveling"],
        faker.number.int({ min: 1, max: 5 })
      ),
      isGoogle,
      googleId: isGoogle ? faker.string.uuid() : "",
      photoUrl: faker.image.avatar(),
    };
  });
};
