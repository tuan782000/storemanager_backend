import express from "express";
import {
  editInfoAvatar,
  editInfoUser,
  editPassword,
  getListUsers,
  getMoneyUserEarn,
  getMonthlyEarningAmounts,
  getMonthlyEarningPaymentAmounts,
  getMonthlyEarnings,
  getUserWithId,
  registerUser,
  softDeleteUser,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/info", getUserWithId);
userRouter.get("/getListEmployees", getListUsers);
userRouter.post("/registerEmployee", registerUser);
userRouter.put("/editInfoUser", editInfoUser);
userRouter.put("/editInfoAvatar", editInfoAvatar);
userRouter.put("/editPassword", editPassword);
userRouter.delete("/deleteEmployee", softDeleteUser);
userRouter.get("/getMoneyUserEarn", getMoneyUserEarn);
userRouter.get("/getMonthlyEarnings", getMonthlyEarnings);
userRouter.get("/getMonthlyEarningAmounts", getMonthlyEarningAmounts);
userRouter.get(
  "/getMonthlyEarningPaymentAmounts",
  getMonthlyEarningPaymentAmounts
);

export { userRouter };
