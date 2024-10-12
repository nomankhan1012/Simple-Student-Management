import express from "express";
import {db} from "../loadSchema.js";

import { promisify } from "util";


import {authenticate,authorizeAdmin} from "../middleware/auth.js";

// Promisify db methods
const dbRun = promisify(db.run.bind(db));
const dbAll = promisify(db.all.bind(db));

const router = express.Router();


// Create course route
router.post("/create-course",authenticate,authorizeAdmin, async (req, res) => {
    const { course_name, course_description, credit_hours } = req.body;
  
    try {
      const sql = `INSERT INTO courses (course_name, course_description, credit_hours) VALUES (?, ?, ?)`;
      await dbRun(sql, [course_name, course_description, credit_hours]);
      res.status(201).json({
        msg: "Course created successfully",
        course: { course_name, course_description, credit_hours },
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });
  
  // Get all courses route
  router.get("/courses", authenticate,async (req, res) => {
    try {
      const rows = await dbAll(`SELECT * FROM courses`);
      res.status(200).json(rows);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });
  
  // Update course by ID route
  router.put("/update-course/:id",authenticate,authorizeAdmin, async (req, res) => {
    const { id } = req.params;
    const { course_name, course_description, credit_hours } = req.body;
  
    try {
      const sql = `UPDATE courses SET course_name = ?, course_description = ?, credit_hours = ? WHERE course_id = ?`;
      await dbRun(sql, [course_name, course_description, credit_hours, id]);
      res.status(200).json({
        msg: "Course updated successfully",
        updatedCourse: { id, course_name, course_description, credit_hours },
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });
  
  // Delete course by ID route
  router.delete("/delete-course/:id",authenticate,authorizeAdmin, async (req, res) => {
    const { id } = req.params;
  
    try {
      await dbRun(`DELETE FROM courses WHERE course_id = ?`, [id]);
      res
        .status(200)
        .json({ msg: `Course deleted with the id ${id} successfully` });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });
  
  // Delete all courses route
  router.delete("/delete-all-courses", authenticate,authorizeAdmin,async (req, res) => {
    try {
      await dbRun(`DELETE FROM courses`);
      res.status(200).json({ msg: "All courses deleted successfully!" });
    } catch (err) {
      return res.status(500).json({
        error: "Error occurred while deleting courses",
        details: err.message,
      });
    }
  });
  
  export default router;