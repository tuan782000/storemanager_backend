import express from "express";
import {
  createWorkSession,
  getListWorkSession,
  getWorkSessionById,
  getWorkSessionsByEmployeeId,
  softDeleteWorkSession,
  updateWorkSession,
  updateWorkSessionByAdmin,
} from "../controllers/workSessionController.js";

const workSessionRouter = express.Router();

workSessionRouter.post("/createWorkSession", createWorkSession);
workSessionRouter.get("/listWorkSessions", getListWorkSession);
workSessionRouter.get("/workSessionById", getWorkSessionById);
workSessionRouter.put("/updatedWorkSessionById", updateWorkSession);
workSessionRouter.put("/updateWorkSessionByAdmin", updateWorkSessionByAdmin);
workSessionRouter.delete("/softDeleteWorkSessionById", softDeleteWorkSession);
workSessionRouter.get(
  "/getWorkSessionsByEmployeeId",
  getWorkSessionsByEmployeeId
);

export { workSessionRouter };
