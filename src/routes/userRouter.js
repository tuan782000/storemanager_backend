import express from "express";
import {
  editInfoAvatar,
  editInfoUser,
  editPassword,
  getListUsers,
  getUserWithId,
  softDeleteUser,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/info", getUserWithId);
userRouter.get("/getListEmployees", getListUsers);
userRouter.put("/editInfoUser", editInfoUser);
userRouter.put("/editInfoAvatar", editInfoAvatar);
userRouter.put("/editPassword", editPassword);
userRouter.delete("/deleteEmployee", softDeleteUser);

export { userRouter };
