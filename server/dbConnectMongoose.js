const mongoose = require("mongoose");

module.exports = async () => {
  const mongouri =
    "mongodb+srv://sachin:wyftm4NagG1LLA8t@cluster0.ibtuoaa.mongodb.net/?retryWrites=true&w=majority";

  try {
    const connect = await mongoose.connect(mongouri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    console.log(`MongoDB connected: ${connect.connection.host}`);
  } catch (error) {
    console.log("error");
    process.exit(1);
  }
};
