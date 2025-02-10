import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { create, deletePost, getAllPosts, getPosts, updatePost } from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", verifyToken, create);

router.get("/getposts/:id", getPosts);

router.get("/posts/getallposts/", verifyToken, getAllPosts);

router.delete("/deletepost/:userId/:postId", verifyToken, deletePost);

router.put("/updatepost/:userId/:postId", verifyToken, updatePost);



export default router;