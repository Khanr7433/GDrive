import mongoose from "mongoose";

function connectToDB() {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connected to DB");
    })
    .catch((err) => {
      console.error("DB connection error:", err);
    });
}

export default connectToDB;
