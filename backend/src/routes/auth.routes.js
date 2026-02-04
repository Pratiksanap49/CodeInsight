import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

const router = express.Router();

/* -----------------------------
   Register
------------------------------ */
router.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const err = new Error("Email and password required");
      err.status = 400;
      throw err;
    }

    const existing = await User.findOne({ email });
    if (existing) {
      const err = new Error("User already exists");
      err.status = 409;
      throw err;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      passwordHash
    });

    res.status(201).json({ userId: user._id });
  } catch (err) {
    next(err);
  }
});

/* -----------------------------
   Login
------------------------------ */
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const err = new Error("Email and password required");
      err.status = 400;
      throw err;
    }

    const user = await User.findOne({ email });
    if (!user) {
      const err = new Error("Invalid credentials");
      err.status = 401;
      throw err;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      const err = new Error("Invalid credentials");
      err.status = 401;
      throw err;
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });
  } catch (err) {
    next(err);
  }
});

export default router;
