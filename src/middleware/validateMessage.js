export const validateMessage = (req, res, next) => {
  const { receiver_id, content } = req.body;
  const sender_id = req.user.id;

  if (Number(receiver_id) === sender_id) {
    return res
      .status(400)
      .json({ error: "You Can Not Send a Message To Yourself!" });
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
};

export const validateConversationByID = (req, res, next) => {
  const user_id = req.user.id;
  const otherUserId = req.params.otherUserId;

  if (!Number.isInteger(Number(otherUserId)) || Number(otherUserId) <= 0) {
    return res.status(400).json({ error: "Invalid Receiver ID!" });
  }

  if (Number(otherUserId) === user_id) {
    return res
      .status(400)
      .json({ error: "You Can Not View a Converation With Yourself!" });
  }

  next();
};

export const validateDeleteMessage = (req, res, next) => {
  const id = req.params.id;

  if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
    return res.status(400).json({ error: "Invalid Message ID!" });
  }

  next();
};

export const validateMessageUpdate = (req, res, next) => {
  let { content } = req.body;
  let orderIndex = 1;
  let queryFields = [];
  let values = [];

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

  req.validatedData = { queryFields, values };
  next();
};

export const validateMessageSearch = (req, res, next) => {
  let { content } = req.query;
  let orderIndex = 1;
  let queryFields = [];
  let values = [];

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
    orderIndex++;
  }

  if (queryFields.length === 0) {
    return res
      .status(400)
      .json({ error: "No Valid Field Provided For Search!" });
  }

  req.validatedData = { queryFields, values };
  next();
};
