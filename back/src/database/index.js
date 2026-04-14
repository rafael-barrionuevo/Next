const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI_TEST );
    console.log("MongoDB: Conectado com sucesso.");
  } catch (error) {
    console.error("MongoDB: Erro ao conectar (\n", error.message, "\n).");
    process.exit(1);
  }
};

module.exports = connectDB;
