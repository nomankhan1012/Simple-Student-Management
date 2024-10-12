import express from "express";
import {db} from "../loadSchema.js";
import bcrypt from "bcrypt";
import { promisify } from "util";

import { authenticate, authorizeAdmin } from "../middleware/auth.js";

const dbRun = promisify(db.run.bind(db));
const dbAll = promisify(db.all.bind(db));

const router = express.Router();

// Create instructor route
router.post("/create-instructor",authenticate, authorizeAdmin, async (req, res) => {
  const { first_name, last_name, email, phone, department } =
    req.body;

  try {
    const sql = `INSERT INTO instructors (first_name, last_name, email, phone) VALUES ( ?, ?, ?, ?)`;
    await dbRun(sql, [
      first_name,
      last_name,
      email,
      phone,
      department,
    ]);

    res.status(201).json({
      msg: "Instructor created successfully",
      instructor: { first_name, last_name, email, phone, department },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Get all instructors 
router.get("/instructors", authenticate,async (req, res) => {
  try {
    const rows = await dbAll(`SELECT * FROM instructors`);
    res.status(200).json(rows.map(({ password, ...instructor }) => instructor)); // Exclude passwords from response
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Update instructor by ID 
router.put("/update-instructor/:id", authenticate,authorizeAdmin, async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, phone, department } = req.body;

  try {
    const sql = `UPDATE instructors SET first_name = ?, last_name = ?, email = ?, phone = ?, department = ? WHERE id = ?`;
    await dbRun(sql, [first_name, last_name, email, phone, department, id]);
    res.status(200).json({
      msg: `Instructor updated successfully with id: ${id}`,
      updatedInstructor: { first_name, last_name, email, phone, department },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Delete instructor by ID 
router.delete("/delete-instructor/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await dbRun(`DELETE FROM instructors WHERE id = ?`, [id]);
    res
      .status(200)
      .json({ msg: `Instructor deleted with the id ${id} successfully` });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Delete all Instructors
router.delete("/delete-all-instructors", authenticate,authorizeAdmin,async (req, res) => {
  try {
    await dbRun(`DELETE FROM instructors`);
    res
      .status(200)
      .json({ msg: `All Instructors deleted successfully` });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;