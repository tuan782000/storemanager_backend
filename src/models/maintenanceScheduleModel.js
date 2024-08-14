import mongoose from "mongoose";

const MaintenanceScheduleSchema = new mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customers",
    required: true,
  },
  employee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  work_session_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "workSessions",
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
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
  },
});

const MaintenanceScheduleModel = mongoose.model(
  "maintenanceSchedules",
  MaintenanceScheduleSchema
);

export { MaintenanceScheduleModel };
