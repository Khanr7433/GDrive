import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
console.log(
  "Environment loaded. MONGODB_URI:",
  process.env.MONGODB_URI ? "✓ Loaded" : "✗ Missing"
); // Debug log
import userRouter from "./routes/user.routes.js";
import connectToDB from "./config/db.js";
connectToDB();
import cookieParser from "cookie-parser";
const app = express();
import indexRouter from "./routes/index.routes.js";

// CORS configuration for React frontend
app.use(
  cors({
    origin: "http://localhost:5173", // Vite dev server default port
    credentials: true,
  })
);

// Set views directory (for backward compatibility)
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("view options", { async: true });
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api", indexRouter);
app.use("/api/user", userRouter);

// Legacy routes (for backward compatibility)
app.use("/", indexRouter);
app.use("/user", userRouter);

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception");
  console.log(err);
});

const PORT = process.env.PORT || 5000; // Changed default port to 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
