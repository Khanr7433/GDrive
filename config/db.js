import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

function connectToDB() {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("Connected to DB");
    })
    .catch((err) => {
      console.error("DB connection error:", err);
    });
}

export default connectToDB;
