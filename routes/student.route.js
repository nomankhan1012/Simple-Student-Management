import express from "express";
import { db } from "../loadSchema.js";

import { promisify } from "util";

import { authenticate, authorizeAdmin } from "../middleware/auth.js";

// Promisify db methods
const dbRun = promisify(db.run.bind(db));
const dbAll = promisify(db.all.bind(db));

const router = express.Router();

// Update student route
router.put(
  "/update-student/:id",
  authenticate,
  authorizeAdmin,
  async (req, res) => {
    const { id } = req.params;
    const {
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
    } = req.body;

    try {
      const sql = `UPDATE students SET first_name = ?, last_name = ?, username = ?, email = ?, phone = ?, address = ?, gender = ?, age = ?, is_admin = ?, is_verified = ?, is_active = ? WHERE id = ?`;

      await dbRun(sql, [
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
        id,
      ]);

      res.status(200).json({
        msg: `User updated successfully with id: ${id}`,
        updatedData: {
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
      return res.status(500).json({ error: err.message });
    }
  }
);

// Delete student by ID route
router.delete("/delete/:id", authenticate, authorizeAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    await dbRun(`DELETE FROM students WHERE id = ?`, [id]);
    res
      .status(200)
      .json({ msg: `Student deleted with the id ${id} successfully` });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Get all users route (admin-only)
router.get("/students", authenticate, authorizeAdmin, async (req, res) => {
  try {
    const rows = await dbAll(`SELECT * FROM students`);
    res.status(200).json(rows.map(({ password, ...user }) => user)); // Exclude passwords from response
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Delete all students route
router.delete(
  "/delete-all-students",
  authenticate,
  authorizeAdmin,
  async (req, res) => {
    try {
      await dbRun(`DELETE FROM students`);
      res.status(200).json({ msg: "All students deleted successfully!" });
    } catch (err) {
      return res.status(500).json({
        error: "Error occurred while deleting students",
        details: err.message,
      });
    }
  }
);

export default router;
