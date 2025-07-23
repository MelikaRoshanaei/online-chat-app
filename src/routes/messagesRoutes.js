import express from "express";
import {
  sendMessage,
  getConversations,
  getOneConversationByID,
  deleteMessage,
  updateMessage,
  searchMessage,
} from "../controllers/messagesController.js";
import {
  validateConversationByID,
  validateMessage,
  validateDeleteMessage,
  validateMessageUpdate,
  validateMessageSearch,
} from "../middleware/validateMessage.js";
import { authMiddleware } from "../middleware/authentication.js";
import { restrictTo } from "../middleware/authorization.js";

const router = express.Router();

router.post("/", authMiddleware, validateMessage, sendMessage);
router.get("/", authMiddleware, getConversations);
router.get("/search", authMiddleware, validateMessageSearch, searchMessage);
router.get(
  "/:otherUserId",
  authMiddleware,
  validateConversationByID,
  getOneConversationByID
);
router.delete("/:id", authMiddleware, validateDeleteMessage, deleteMessage);
router.patch(
  "/:id",
  authMiddleware,
  restrictTo("user"),
  validateMessageUpdate,
  updateMessage
);

export default router;
