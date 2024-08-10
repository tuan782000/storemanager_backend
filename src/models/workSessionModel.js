import mongoose from "mongoose";

const WorkSessionSchema = new mongoose.Schema({
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
  start_time: {
    type: Date,
  },
  end_time: {
    type: Date,
  },
  result: {
    type: String,
    default: null,
  },
  amount: {
    // Số tiền của công việc, yêu cầu phải có
    type: Number,
    required: true,
  },
  payment_amount: {
    // Số tiền mà nhân viên nhận được (30% của amount), yêu cầu phải có.
    type: Number,
    required: true,
  },
  before_image: {
    // nó có thể là danh sách các ảnh trước khi làm
    type: [String],
    default: [],
  },
  after_image: {
    // nó có thể là danh sách các ảnh sau khi làm
    type: [String],
    default: [],
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["assigned", "accepted", "rejected", "completed"],
    default: "assigned",
  },
  rejection_reason: {
    type: String,
    default: null,
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
  maintenance_schedule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "maintenanceSchedules",
  },
  comments: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
  },
  //   maintenance_schedule: [{
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'MaintenanceSchedule',
  //   }],
  //   comments: [{
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Comment',
  //   }],
});

const WorkSessionModel = mongoose.model("workSessions", WorkSessionSchema);

export { WorkSessionModel };
