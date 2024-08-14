import express from "express";
import {
  createComment,
  getAllComment,
  getComment,
  softDeleteComment,
  updateComment,
} from "../controllers/commentController.js";

const commentRouter = express.Router();

commentRouter.post("/createComment", createComment);
commentRouter.get("/getComment", getComment);
commentRouter.get("/getAllComment", getAllComment);
commentRouter.put("/putComment", updateComment);
commentRouter.delete("/softDeleteComment", softDeleteComment);

export { commentRouter };
