const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Logic junior Test Series API",
      version: "0.1.0",
      description:
        "This is a Test series for logic junior application backend",
    
      contact: {
        name: "logic junior",
        url: "https://logicjunior.com",
        email: "info@email.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: [__dirname + '/../routes/*.js'],
};

module.exports=options;