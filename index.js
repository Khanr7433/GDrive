import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.config.js";
import userRouter from "./routes/user.route.js";

dotenv.config();

const app = express();
connectDB();

app.use(express.json());

app.use("/users", userRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
