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

export const getUserById = async (req, res, next) => {
  let client;
  try {
    const { id } = req.params;
    client = await pool.connect();

    const result = await client.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User Not Found!" });
    }

    if (Number(id) !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden!" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    next(err);
  } finally {
    if (client) client.release();
  }
};
