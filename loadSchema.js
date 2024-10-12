import sqlite3 from "sqlite3";
import fs from "fs";
import path from "path";

const dbPath = path.resolve("database.db");
const schemaPath = path.resolve("./config/schema.sql");

// Creating the database connection
export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
    process.exit(1);
  } else {
    console.log("Connected to the database successfully");
  }
});

// Function to load schema
const loadSchema = () => {
  fs.readFile(schemaPath, "utf-8", (err, schema) => {
    if (err) {
      console.error("Error reading schema file:", err.message);
      process.exit(1);
    }

    db.serialize(() => {
      db.exec(schema, (err) => {
        if (err) {
          console.error("Error executing schema:", err.message);
          process.exit(1);
        } else {
          console.log("Database schema loaded successfully");
        }
      });
    });
  });
};

loadSchema();

