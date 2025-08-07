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
          const message =
            "Username already exists. Please choose a different username.";
          if (
            req.headers.accept &&
            req.headers.accept.includes("application/json")
          ) {
            return res.status(400).json({ message });
          } else {
            return res.redirect(
              `/user/register?message=${encodeURIComponent(message)}`
            );
          }
        }
        if (existingUser.email === email) {
          const message =
            "Email already registered. Please use a different email or login.";
          if (
            req.headers.accept &&
            req.headers.accept.includes("application/json")
          ) {
            return res.status(400).json({ message });
          } else {
            return res.redirect(
              `/user/register?message=${encodeURIComponent(message)}`
            );
          }
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

      // Check if this is an API request (React frontend) or regular request
      if (
        req.headers.accept &&
        req.headers.accept.includes("application/json")
      ) {
        res.json({
          message: "Registration successful! Welcome to GDrive",
          user: {
            userId: newUser._id,
            email: newUser.email,
            username: newUser.username,
          },
        });
      } else {
        res.redirect(
          "/home?message=Registration successful! Welcome to GDrive"
        );
      }
    } catch (error) {
      console.error("Registration error:", error);

      // Handle MongoDB duplicate key error
      if (error.code === 11000) {
        let message;
        if (error.keyPattern.username) {
          message =
            "Username already exists. Please choose a different username.";
        } else if (error.keyPattern.email) {
          message =
            "Email already registered. Please use a different email or login.";
        } else {
          message = "Registration failed. Please try again.";
        }

        if (
          req.headers.accept &&
          req.headers.accept.includes("application/json")
        ) {
          return res.status(400).json({ message });
        } else {
          return res.redirect(
            `/user/register?message=${encodeURIComponent(message)}`
          );
        }
      }

      const message = "Registration failed. Please try again.";
      if (
        req.headers.accept &&
        req.headers.accept.includes("application/json")
      ) {
        return res.status(500).json({ message });
      } else {
        return res.redirect(
          `/user/register?message=${encodeURIComponent(message)}`
        );
      }
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
        const message = "username or password is incorrect";
        if (
          req.headers.accept &&
          req.headers.accept.includes("application/json")
        ) {
          return res.status(400).json({ message });
        } else {
          return res.redirect(
            `/user/login?message=${encodeURIComponent(message)}`
          );
        }
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        const message = "username or password is incorrect";
        if (
          req.headers.accept &&
          req.headers.accept.includes("application/json")
        ) {
          return res.status(400).json({ message });
        } else {
          return res.redirect(
            `/user/login?message=${encodeURIComponent(message)}`
          );
        }
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

      // Check if this is an API request (React frontend) or regular request
      if (
        req.headers.accept &&
        req.headers.accept.includes("application/json")
      ) {
        res.json({
          message: "Login successful! Welcome back",
          user: {
            userId: user._id,
            email: user.email,
            username: user.username,
          },
        });
      } else {
        res.redirect("/home?message=Login successful! Welcome back");
      }
    } catch (error) {
      console.error("Login error:", error);
      const message = "Login failed. Please try again.";
      if (
        req.headers.accept &&
        req.headers.accept.includes("application/json")
      ) {
        return res.status(500).json({ message });
      } else {
        return res.redirect(
          `/user/login?message=${encodeURIComponent(message)}`
        );
      }
    }
  }
);

router.post("/logout", (req, res) => {
  res.clearCookie("token");

  // Check if this is an API request (React frontend) or regular request
  if (req.headers.accept && req.headers.accept.includes("application/json")) {
    res.json({
      message: "You have been logged out successfully",
    });
  } else {
    res.redirect("/user/login?message=You have been logged out successfully");
  }
});

// Legacy GET route for logout (for backward compatibility)
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/user/login?message=You have been logged out successfully");
});

export default router;
