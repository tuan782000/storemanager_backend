import express from "express";
import {
  createWorkSession,
  getListWorkSession,
  getWorkSessionById,
  getWorkSessionsByEmployeeId,
  softDeleteWorkSession,
  updateWorkSession,
} from "../controllers/workSessionController.js";

const workSessionRouter = express.Router();

workSessionRouter.post("/createWorkSession", createWorkSession);
workSessionRouter.get("/listWorkSessions", getListWorkSession);
workSessionRouter.get("/workSessionById", getWorkSessionById);
workSessionRouter.put("/updatedWorkSessionById", updateWorkSession);
workSessionRouter.delete("/softDeleteWorkSessionById", softDeleteWorkSession);
workSessionRouter.get(
  "/getWorkSessionsByEmployeeId",
  getWorkSessionsByEmployeeId
);

export { workSessionRouter };
