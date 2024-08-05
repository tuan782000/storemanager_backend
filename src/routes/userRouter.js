import express from "express";
import {
  editInfoAvatar,
  editInfoUser,
  editPassword,
  getUser,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/info", getUser);
userRouter.put("/editInfoUser", editInfoUser);
userRouter.put("/editInfoAvatar", editInfoAvatar);
userRouter.put("/editPassword", editPassword);

export { userRouter };
