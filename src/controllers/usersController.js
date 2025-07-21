import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const saltRounds = 10;

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

export const registerUser = async (req, res, next) => {
  let client;
  try {
    const { name, email, password, role } = req.body;
    client = await pool.connect();

    const existingEmail = await client.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingEmail.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "User With This Email Address Already Exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await client.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, hashedPassword, role]
    );

    const token = jwt.sign(
      { id: result.rows[0].id, role: result.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      token,
      user: {
        id: result.rows[0].id,
        name: result.rows[0].name,
        role: result.rows[0].role,
      },
    });
  } catch (err) {
    next(err);
  } finally {
    if (client) client.release();
  }
};
