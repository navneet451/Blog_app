import express from "express";
import { createComment, deleteComment, editComment, getAllComments, getComments } from "../controllers/comment.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

router.post("/create", verifyToken, createComment);

router.get("/getcomments/:postId", getComments);

router.get("/getallcomments", verifyToken, getAllComments);

router.put("/editcomment/:commentId", verifyToken, editComment);

router.delete("/deletecomment/:commentId", verifyToken, deleteComment);

export default router;
