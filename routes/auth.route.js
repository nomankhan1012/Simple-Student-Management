import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {db} from "../loadSchema.js";
import { promisify } from "util";

// Promisify db methods
const dbRun = promisify(db.run.bind(db));
const dbGet = promisify(db.get.bind(db));

const router = express.Router();

// User signup route
router.post("/signup", async (req, res) => {
  const {
    first_name,
    last_name,
    username,
    email,
    password,
    phone,
    address,
    gender,
    age,
    is_admin,
    is_verified,
    is_active,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `INSERT INTO students (first_name, last_name, username, email, password, phone, address, gender, age, is_admin, is_verified, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    await dbRun(sql, [
      first_name,
      last_name,
      username,
      email,
      hashedPassword,
      phone,
      address,
      gender,
      age,
      is_admin,
      is_verified,
      is_active,
    ]);

    res.status(201).json({
      msg: "Signup successful",
      user: {
        first_name,
        last_name,
        username,
        email,
        phone,
        address,
        gender,
        age,
        is_admin,
        is_verified,
        is_active,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SignIn route
router.post("/signIn", async (req, res) => {
  const { email, password } = req.body;

  try {
    const sql = `SELECT * FROM students WHERE email = ?`;
    const user = await dbGet(sql, [email]);

    if (!user) {
      return res
        .status(401)
        .json({ error: "Invalid credentials: user not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { is_admin: user.is_admin, id: user.id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    const { password: _, ...userData } = user; // Remove password from user data

    const options = {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    };

    res
      .status(200)
      .cookie("token", token, options)
      .json({ msg: "Login successful", user: userData, token });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;