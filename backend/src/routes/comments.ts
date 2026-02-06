import express from "express";
import { addComment, deleteComment } from "../controllers/commentController";
const router = express.Router();
router.post("/:ticketId", addComment);
router.delete("/:id", deleteComment);
export default router;
