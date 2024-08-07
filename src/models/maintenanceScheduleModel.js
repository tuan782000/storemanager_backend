import mongoose from "mongoose";

const MaintenanceScheduleSchema = new mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  work_session_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WorkSession",
    required: true,
  },
  scheduled_date: {
    type: Date,
    required: true,
  },
  notes: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const MaintenanceScheduleModel = mongoose.model(
  "maintenanceSchedules",
  MaintenanceScheduleSchema
);

export { MaintenanceScheduleModel };
