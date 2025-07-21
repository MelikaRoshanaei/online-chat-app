import express from "express";
import pool from "./config/db.js";

const app = express();
const PORT = process.env.PORT;

// Test DB Connection
(async () => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT NOW()");
    console.log("✅ DB Connected Successfully!");
    console.log("Current Time:", result.rows[0].now);
    client.release();
  } catch (err) {
    console.error("❌ DB Connection Failed:", err.message);
    process.exit(1); // Stop the app if DB fails
  }
})();

// Routes
app.get("/", (req, res) => {
  res.send("Root Route Placeholder!");
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

export default app;
