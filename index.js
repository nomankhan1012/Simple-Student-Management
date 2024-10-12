import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js"; 
import studentRoutes from "./routes/student.route.js"; 
import courseRoutes from "./routes/course.route.js"; 
import instructorRoutes from "./routes/instructor.route.js"; 

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());


app.get("/", (req, res) => {
  res.send("Welcome to Simple Student Management API");
});

app.use("/api/auth", authRoutes);
app.use("/api/auth", studentRoutes);
app.use("/api/auth", courseRoutes);
app.use("/api/auth", instructorRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
