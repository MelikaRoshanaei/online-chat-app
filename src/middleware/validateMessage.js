export const validateMessage = async (req, res, next) => {
  const { receiver_id, content } = req.body;
  const sender_id = req.user.id;

  let client;
  try {
    client = await pool.connect();
    const result = await client.query("SELECT id FROM users WHERE id = $1", [
      receiver_id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Receiver Not Found!" });
    }

    if (Number(receiver_id) === sender_id) {
      return res
        .status(400)
        .json({ error: "You Cannot Send a Message To Yourself!" });
    }

    if (!Number.isInteger(Number(receiver_id)) || Number(receiver_id) <= 0) {
      return res.status(400).json({ error: "Invalid Receiver ID!" });
    }

    if (
      typeof content !== "string" ||
      content.trim().length === 0 ||
      content.length > 1000
    ) {
      return res.status(400).json({ error: "Invalid Message Content!" });
    }

    req.body.content = content.trim();
    next();
  } catch (err) {
    next(err);
  } finally {
    if (client) client.release();
  }
};

export const validateConversationByID = async (req, res, next) => {
  const user_id = req.user.id;
  const otherUserId = req.params.otherUserId;

  let client;
  try {
    client = await pool.connect();
    const result = await client.query("SELECT id FROM users WHERE id = $1", [
      otherUserId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User Not Found!" });
    }

    if (Number(otherUserId) === user_id) {
      return res
        .status(400)
        .json({ error: "You Cannot View a Conversation With Yourself!" });
    }

    next();
  } catch (err) {
    next(err);
  } finally {
    if (client) client.release();
  }
};

export const validateDeleteMessage = async (req, res, next) => {
  const id = req.params.id;
  const userId = req.user.id;
  const userRole = req.user.role;

  if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
    return res.status(400).json({ error: "Invalid Message ID!" });
  }

  let client;
  try {
    client = await pool.connect();
    const result = await client.query(
      "SELECT sender_id FROM messages WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Message Not Found!" });
    }

    const senderId = result.rows[0].sender_id;

    if (senderId !== userId && userRole !== "admin") {
      return res.status(403).json({ error: "Forbidden!" });
    }

    next();
  } catch (err) {
    next(err);
  } finally {
    if (client) client.release();
  }
};

export const validateMessageUpdate = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  let { content } = req.body;

  let queryFields = [];
  let values = [];
  let orderIndex = 1;

  if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
    return res.status(400).json({ error: "Invalid Message ID!" });
  }

  if (content !== undefined) {
    if (
      typeof content !== "string" ||
      content.trim().length === 0 ||
      content.length > 1000
    ) {
      return res.status(400).json({ error: "Invalid Message Content!" });
    }

    content = content.trim();
    queryFields.push(`content = $${orderIndex}`);
    values.push(content);
    orderIndex++;
  }

  if (queryFields.length === 0) {
    return res
      .status(400)
      .json({ error: "No Valid Field Provided For Update!" });
  }

  let client;
  try {
    client = await pool.connect();
    const result = await client.query(
      "SELECT sender_id FROM messages WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Message Not Found!" });
    }

    if (result.rows[0].sender_id !== userId) {
      return res.status(403).json({ error: "Forbidden!" });
    }

    req.validatedData = { queryFields, values };
    next();
  } catch (err) {
    next(err);
  } finally {
    if (client) client.release();
  }
};

export const validateMessageSearch = (req, res, next) => {
  const userId = req.user.id;
  let { content } = req.query;
  let orderIndex = 2; // Start from 2, $1 will be user ID
  let queryFields = [`(sender_id = $1 OR receiver_id = $1)`];
  let values = [userId];

  if (content !== undefined) {
    if (
      typeof content !== "string" ||
      content.trim().length === 0 ||
      content.length > 255
    ) {
      return res.status(400).json({ error: "Invalid Message Content!" });
    }

    content = content.trim();
    queryFields.push(`content ILIKE $${orderIndex}`);
    values.push(`%${content}%`);
  }

  req.validatedData = { queryFields, values };
  next();
};
