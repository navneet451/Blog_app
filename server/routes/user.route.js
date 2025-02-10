import express from "express";
import { deleteUser, getUser, getUsers, signOut, test, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/user", test);

router.patch("/user/:id", verifyToken, updateUser);

router.delete("/user/:id", verifyToken, deleteUser);

router.post("/user", signOut);

router.get("/getusers", verifyToken, getUsers);

router.get("/user/:userId", getUser);

export default router;
