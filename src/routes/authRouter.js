import express from "express";
import { register } from "../controllers/authController.js";

const authRouter = express.Router();

// authRouter.get("/login", (_req, res) => {
//   res.send("Hello");
// });
authRouter.post("/login", (req, res) => {
  console.log(req.body);
  res.send("Đăng nhập thành công");
});

// authRouter.post("/register", (req, res) => {
//   console.log(req.body);
//   res.send("Đăng ký thành công");
// });

authRouter.post("/register", register);

export { authRouter };
