import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import authRoutes from "./routes/auth.route.js"; // Import your routes
import studentRoutes from "./routes/student.route.js"; // Import your routes
import courseRoutes from "./routes/course.route.js"; // Import your routes
import instructorRoutes from "./routes/instructor.route.js"; // Import your routes

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());
app.use(helmet()); // Security middleware

app.get("/", (req, res) => {
  res.send("Hey from Node server");
});

// Use your routes
app.use("/api/auth", authRoutes);
app.use("/api/auth", studentRoutes);
app.use("/api/auth", courseRoutes);
app.use("/api/auth", instructorRoutes);
// Add other route imports...

// Error handling middleware (if needed)
// app.use((err, req, res, next) => {
//   res.status(err.status || 500).json({ error: err.message });
// });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
