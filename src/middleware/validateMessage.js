export const validateMessage = (req, res, next) => {
  const { receiver_id, content } = req.body;
  const sender_id = req.user.id;

  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "No Authenticated User!" });
  }

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

  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "No Authenticated User!" });
  }

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
