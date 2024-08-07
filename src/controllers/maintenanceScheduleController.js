import { MaintenanceScheduleModel } from "../models/maintenanceScheduleModel.js";

const getMaintenanceSchedule = async (req, res) => {
  try {
    const schedules = await MaintenanceScheduleModel.find({
      isDeleted: false,
    });

    if (schedules) {
      res.status(200).json({
        message: "Lấy danh sách lịch bảo trì thành công",
        data: schedules,
      });
    } else {
      res.status(400).json({
        message: "Không tìm thấy danh sách lịch bảo trì",
        data: schedules,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách lịch bảo trì",
      error: error.message,
    });
  }
};

const createMaintenanceSchedule = async (req, res) => {
  const { customer_id, work_session_id, scheduled_date, notes } = req.body;

  if (!customer_id || !work_session_id || !scheduled_date) {
    return res.status(400).json({
      message:
        "Các trường customer_id, work_session_id, và scheduled_date là bắt buộc",
    });
  }

  try {
    const newSchedule = new MaintenanceScheduleModel({
      customer_id,
      work_session_id,
      scheduled_date,
      notes,
    });

    await newSchedule.save();

    res.status(201).json({
      message: "Tạo lịch bảo trì thành công",
      data: newSchedule,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi tạo lịch bảo trì",
      error: error.message,
    });
  }
};

const getMaintenanceScheduleById = async (req, res) => {
  const { id } = req.params;

  if (id) {
    try {
      const schedule = await MaintenanceScheduleModel.findOne({
        _id: id,
        isDeleted: false,
      });

      if (schedule) {
        res.status(200).json({
          message: "Lấy thông tin lịch bảo trì thành công",
          data: schedule,
        });
      } else {
        return res.status(404).json({
          message: "Không tìm thấy lịch bảo trì với ID này",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi lấy thông tin lịch bảo trì",
        error: error.message,
      });
    }
  } else {
    res.status(400).json({
      message: "ID lịch bảo trì không được cung cấp",
    });
  }
};

const updateMaintenanceSchedule = async (req, res) => {
  const { id } = req.query;
  const { customer_id, work_session_id, scheduled_date, notes } = req.body;

  if (id) {
    try {
      const updatedSchedule = await MaintenanceScheduleModel.findByIdAndUpdate(
        {
          _id: id,
          isDeleted: false,
        },
        {
          customer_id,
          work_session_id,
          scheduled_date,
          notes,
          updated_at: Date.now(),
        },
        { new: true }
      );

      if (updatedSchedule) {
        res.status(200).json({
          message: "Cập nhật lịch bảo trì thành công",
          data: updatedSchedule,
        });
      } else {
        return res.status(404).json({
          message: "Không tìm thấy lịch bảo trì với ID này",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi cập nhật lịch bảo trì",
        error: error.message,
      });
    }
  } else {
    res.status(400).json({
      message: "ID lịch bảo trì không được cung cấp",
    });
  }
};

const softDeleteMaintenanceSchedule = async (req, res) => {
  const { id } = req.query;

  try {
    const deletedSchedule = await MaintenanceScheduleModel.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: Date.now() },
      { new: true }
    );

    if (!deletedSchedule) {
      return res.status(404).json({
        message: "Không tìm thấy lịch bảo trì với ID này",
      });
    }

    res.status(200).json({
      message: "Xóa mềm lịch bảo trì thành công",
      data: deletedSchedule,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi xóa mềm lịch bảo trì",
      error: error.message,
    });
  }
};

export {
  getMaintenanceSchedule,
  createMaintenanceSchedule,
  updateMaintenanceSchedule,
  softDeleteMaintenanceSchedule,
  getMaintenanceScheduleById,
};
