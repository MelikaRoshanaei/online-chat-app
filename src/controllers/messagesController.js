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

export const getConversations = async (req, res, next) => {
  let client;
  try {
    const user_id = req.user.id;

    client = await pool.connect();
    const result = await client.query(
      `
      WITH conversations AS (
        SELECT
          CASE
            WHEN sender_id = $1 THEN receiver_id
            ELSE sender_id
          END AS other_user_id,
          m.content,
          m.created_at,
          ROW_NUMBER() OVER (
            PARTITION BY CASE
              WHEN sender_id = $1 THEN receiver_id
              ELSE sender_id
            END
            ORDER BY m.created_at DESC
          ) AS rn
        FROM messages m
        WHERE sender_id = $1 OR receiver_id = $1
      )
      SELECT
        c.other_user_id AS user_id,
        u.name AS user_name,
        c.content AS last_message,
        c.created_at AS last_message_timestamp
      FROM conversations c
      JOIN users u ON c.other_user_id = u.id
      WHERE c.rn = 1
      ORDER BY c.created_at DESC;
      `,
      [user_id]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    next(err);
  } finally {
    if (client) client.release();
  }
};

export const getOneConversationByID = async (req, res, next) => {
  let client;
  try {
    const user_id = req.user.id;
    const otherUserId = req.params.otherUserId;

    client = await pool.connect();

    const userExistingCheck = await client.query(
      "SELECT id FROM users WHERE id = $1",
      [otherUserId]
    );

    if (userExistingCheck.rows.length === 0) {
      return res.status(404).json({ error: "User Not Found!" });
    }

    const result = await client.query(
      `
      SELECT id, sender_id, receiver_id, content, created_at
      FROM messages
      WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)
      ORDER BY created_at ASC;
      `,
      [user_id, otherUserId]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    next(err);
  } finally {
    if (client) client.release();
  }
};

export const deleteMessage = async (req, res, next) => {
  let client;
  try {
    const id = req.params.id;
    client = await pool.connect();

    const messageCheck = await client.query(
      "SELECT sender_id FROM messages WHERE id = $1",
      [id]
    );

    if (messageCheck.rows.length === 0) {
      return res.status(404).json({ error: "Message Not Found!" });
    }

    if (
      messageCheck.rows[0].sender_id !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "Forbidden!" });
    }

    const result = await client.query(
      "DELETE FROM messages WHERE id = $1 RETURNING *",
      [id]
    );

    res.status(200).json(result.rows[0]);
  } catch (err) {
    next(err);
  } finally {
    if (client) client.release();
  }
};

export const updateMessage = async (req, res, next) => {
  let client;
  try {
    const { id } = req.params;
    const { queryFields, values } = req.validatedData;
    client = await pool.connect();

    const messageCheck = await client.query(
      "SELECT sender_id FROM messages WHERE id = $1",
      [id]
    );

    if (messageCheck.rows.length === 0) {
      return res.status(404).json({ error: "Message Not Found!" });
    }

    if (messageCheck.rows[0].sender_id !== req.user.id) {
      return res.status(403).json({ error: "Forbidden!" });
    }

    const result = await client.query(
      `UPDATE messages SET ${queryFields.join(", ")} WHERE id = $${
        values.length + 1
      } RETURNING *`,
      [...values, id]
    );

    res.status(200).json(result.rows[0]);
  } catch (err) {
    next(err);
  } finally {
    if (client) client.release();
  }
};
