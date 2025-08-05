import express from "express";
import userRouter from "./routes/user.routes.js";
import dotenv from "dotenv";
dotenv.config();
import connectToDB from "./config/db.js";
connectToDB();
import cookieParser from "cookie-parser";
const app = express();
import indexRouter from "./routes/index.routes.js";

app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);
app.use("/user", userRouter);

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception");
  console.log(err);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
