import express from "express";
import {
  createComment,
  getComment,
  softDeleteComment,
  updateComment,
} from "../controllers/commentController.js";

const commentRouter = express.Router();

commentRouter.post("/createComment", getComment);
commentRouter.get("/getComment", createComment);
commentRouter.put("/putComment", updateComment);
commentRouter.delete("/softDeleteComment", softDeleteComment);

export { commentRouter };
