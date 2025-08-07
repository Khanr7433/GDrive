import express from "express";
const router = express.Router();
import { body, validationResult } from "express-validator";
import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

router.get("/register", (req, res) => {
  // Get message from query parameter
  const message = req.query.message || null;
  res.render("register", { message: message });
});

router.post(
  "/register",
  body("email").trim().isEmail().isLength({ min: 5 }),
  body("password").trim().isLength({ min: 5 }),
  body("username").trim().isLength({ min: 3 }),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: "Invalid data",
      });
    }

    const { email, username, password } = req.body;

    try {
      // Check if user already exists
      const existingUser = await userModel.findOne({
        $or: [{ username: username }, { email: email }],
      });

      if (existingUser) {
        if (existingUser.username === username) {
          return res.status(400).json({
            message:
              "Username already exists. Please choose a different username.",
          });
        }
        if (existingUser.email === email) {
          return res.status(400).json({
            message:
              "Email already registered. Please use a different email or login.",
          });
        }
      }

      const hashPassword = await bcrypt.hash(password, 10);

      const newUser = await userModel.create({
        email,
        username,
        password: hashPassword,
      });

      // Generate JWT token for the new user
      const token = jwt.sign(
        {
          userId: newUser._id,
          email: newUser.email,
          username: newUser.username,
        },
        process.env.JWT_SECRET
      );

      // Set the token as a cookie
      res.cookie("token", token);

      // Redirect to home page with success message
      res.redirect("/home?message=Registration successful! Welcome to GDrive");
    } catch (error) {
      console.error("Registration error:", error);

      // Handle MongoDB duplicate key error
      if (error.code === 11000) {
        if (error.keyPattern.username) {
          return res.status(400).json({
            message:
              "Username already exists. Please choose a different username.",
          });
        }
        if (error.keyPattern.email) {
          return res.status(400).json({
            message:
              "Email already registered. Please use a different email or login.",
          });
        }
      }

      return res.status(500).json({
        message: "Registration failed. Please try again.",
      });
    }
  }
);

router.get("/login", (req, res) => {
  // Get message from query parameter
  const message = req.query.message || null;
  res.render("login", { message: message });
});

router.post(
  "/login",
  body("username").trim().isLength({ min: 3 }),
  body("password").trim().isLength({ min: 5 }),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: errors.array(),
        message: "Invalid data",
      });
    }

    const { username, password } = req.body;

    try {
      const user = await userModel.findOne({
        username: username,
      });

      if (!user) {
        return res.status(400).json({
          message: "username or password is incorrect",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          message: "username or password is incorrect",
        });
      }

      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          username: user.username,
        },
        process.env.JWT_SECRET
      );

      res.cookie("token", token);

      res.redirect("/home?message=Login successful! Welcome back");
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({
        message: "Login failed. Please try again.",
      });
    }
  }
);

router.get("/logout", (req, res) => {
  res.clearCookie("token");

  res.redirect("/user/login?message=You have been logged out successfully");
});

export default router;
