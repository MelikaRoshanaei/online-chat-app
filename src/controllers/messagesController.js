import pool from "../config/db.js";

export const sendMessage = async (req, res, next) => {
  let client;
  try {
    const { receiver_id, content } = req.body;
    const sender_id = req.user.id;

    client = await pool.connect();

    const receiverExistingCheck = await client.query(
      "SELECT id FROM users WHERE id = $1",
      [receiver_id]
    );

    if (receiverExistingCheck.rows.length === 0) {
      return res.status(404).json({ error: "Receiver Not Found!" });
    }

    const result = await client.query(
      "INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3) RETURNING *",
      [sender_id, receiver_id, content]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  } finally {
    if (client) client.release();
  }
};
