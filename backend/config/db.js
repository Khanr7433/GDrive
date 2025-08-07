import mongoose from "mongoose";

function connectToDB() {
  console.log("MongoDB URI:", process.env.MONGODB_URI); // Debug log

  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not defined in environment variables");
    return;
  }

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
