import express from "express";
import cors from "cors";
import { authRouter } from "./src/routes/authRouter.js";
import { connectDB } from "./src/configs/connectDB.js";
import { errorMiddleHandle } from "./src/middlewares/errorMiddleware.js";
import { userRouter } from "./src/routes/userRouter.js";
import { customerRouter } from "./src/routes/customerRouter.js";

const app = express();

app.use(express.json());
app.use(cors());

const PORT = 7820;

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/customer", customerRouter);

app.use(errorMiddleHandle);

connectDB();

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log(`Server running http://localhost:${PORT}`);
});
