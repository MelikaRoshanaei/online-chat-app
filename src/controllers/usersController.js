import pool from "../config/db.js";

export const getAllUsers = async (req, res, next) => {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query("SELECT * FROM users");

    res.status(200).json(result.rows);
  } catch (err) {
    next(err);
  } finally {
    if (client) client.release();
  }
};
