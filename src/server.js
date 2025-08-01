import express from "express";
import pool from "./config/db.js";
import usersRoutes from "./routes/usersRoutes.js";
import messagesRoutes from "./routes/messagesRoutes.js";
import errorHandler from "./utils/errorHandler.js";
import { socketHandler } from "./socket/socketHandler.js";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const PORT = process.env.PORT;

const httpServer = createServer(app);
const io = new Server(httpServer);

socketHandler(io);

// Middleware
app.use(express.json());

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

// Attach io to requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.get("/", (req, res) => {
  res.send("Root Route Placeholder!");
});
app.use("/api/users", usersRoutes);
app.use("/api/messages", messagesRoutes);

// Error Handling
app.use(errorHandler);

httpServer.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

export default app;
