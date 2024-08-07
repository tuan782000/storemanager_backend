import express from "express";
import {
  createMaintenanceSchedule,
  getMaintenanceSchedule,
  softDeleteMaintenanceSchedule,
  updateMaintenanceSchedule,
} from "../controllers/maintenanceScheduleController";

const maintenanceScheduleRouter = express.Router();

maintenanceScheduleRouter.post(
  "/createMaintenanceSchedule",
  createMaintenanceSchedule
);
maintenanceScheduleRouter.get(
  "/getMaintenanceSchedule",
  getMaintenanceSchedule
);
maintenanceScheduleRouter.put(
  "/putMaintenanceSchedule",
  updateMaintenanceSchedule
);
maintenanceScheduleRouter.delete(
  "/softDeleteMaintenanceSchedule",
  softDeleteMaintenanceSchedule
);

export { maintenanceScheduleRouter };
