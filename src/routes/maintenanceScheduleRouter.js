import express from "express";
import {
  createMaintenanceSchedule,
  getMaintenanceSchedule,
  getMaintenanceScheduleById,
  softDeleteMaintenanceSchedule,
  updateMaintenanceSchedule,
} from "../controllers/maintenanceScheduleController.js";

const maintenanceScheduleRouter = express.Router();

maintenanceScheduleRouter.post(
  "/createMaintenanceSchedule",
  createMaintenanceSchedule
);
maintenanceScheduleRouter.get(
  "/getMaintenanceSchedule",
  getMaintenanceSchedule
);

maintenanceScheduleRouter.get(
  "/maintenanceScheduleById/:id",
  getMaintenanceScheduleById
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
