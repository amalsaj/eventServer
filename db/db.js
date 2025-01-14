const mongoose = require("mongoose");
const URL = process.env.MONGO_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(URL);
    console.log("MongoDB connected successfully✅");
  } catch (error) {
    console.error("Error connectingbbb to MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
