import { MaintenanceScheduleModel } from "../models/maintenanceScheduleModel.js";
import { WorkSessionModel } from "../models/workSessionModel.js";

const getMaintenanceSchedule = async (req, res) => {
  try {
    const schedules = await MaintenanceScheduleModel.find({
      isDeleted: false,
    });

    console.log(schedules);

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
  const { employee_id, customer_id, work_session_id, scheduled_date, notes } =
    req.body;

  if (
    (!employee_id || !customer_id || !work_session_id || !scheduled_date,
    !notes)
  ) {
    return res.status(400).json({
      message: "Phải điền đầy đủ thông tin",
    });
  }

  try {
    const newSchedule = new MaintenanceScheduleModel({
      employee_id,
      customer_id,
      work_session_id,
      scheduled_date,
      notes,
    });

    await newSchedule.save();

    // Cập nhật WorkSession để thêm comment vào danh sách comments
    await WorkSessionModel.findByIdAndUpdate(
      work_session_id,
      { $push: { maintenance_schedule: newSchedule._id } },
      { new: true }
    );

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

// [AxiosError: Request failed with status code 404]
const getMaintenanceScheduleByEmployeeId = async (req, res) => {
  const { employee_id } = req.query;

  if (employee_id) {
    try {
      const schedules = await MaintenanceScheduleModel.find({
        employee_id,
        isDeleted: false,
      });

      if (schedules.length > 0) {
        res.status(200).json({
          message: "Lấy danh sách lịch bảo trì thành công",
          data: schedules,
        });
      } else {
        res.status(404).json({
          message: "Chưa có lịch bảo trì",
          // data: [],
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi lấy danh sách lịch bảo trì",
        error: error.message,
      });
    }
  } else {
    res.status(400).json({
      message: "employee_id không được cung cấp",
    });
  }
};

const checkMaintanceSchedule = async (req, res) => {
  const { employee_id, customer_id, work_session_id } = req.body;

  if ((employee_id, customer_id, work_session_id)) {
    try {
      const schedule = await MaintenanceScheduleModel.find({
        employee_id: employee_id,
        customer_id: customer_id,
        work_session_id: work_session_id,
        isDeleted: false,
      });

      if (schedule.length > 0) {
        res.status(200).json({
          message: "Lấy lịch bảo trì thành công",
          data: schedule,
        });
      } else {
        res.status(404).json({
          message: "Không tìm thấy lịch bảo trì với employee_id này",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi lấy danh sách lịch bảo trì",
        error: error.message,
      });
    }
  } else {
    res.status(400).json({
      message: "employee_id, customer_id, workSession_id không được cung cấp",
    });
  }
};

export {
  getMaintenanceSchedule,
  createMaintenanceSchedule,
  updateMaintenanceSchedule,
  softDeleteMaintenanceSchedule,
  getMaintenanceScheduleById,
  getMaintenanceScheduleByEmployeeId,
  checkMaintanceSchedule,
};
