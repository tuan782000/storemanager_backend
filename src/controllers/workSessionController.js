/** @format */

import { MaintenanceScheduleModel } from '../models/maintenanceScheduleModel.js';
import { WorkSessionModel } from '../models/workSessionModel.js';
import { DateTime } from '../utils/DateTime.js';

const getWorkSessionById = async (req, res) => {
	const { id } = req.query;

	if (id) {
		try {
			const findWorkSessionById = await WorkSessionModel.findOne({
				_id: id,
				isDeleted: false,
			});

			if (findWorkSessionById) {
				res.status(200).json({
					message: 'Lấy thông tin phiên làm việc thành công',
					data: findWorkSessionById,
				});
			} else {
				res.status(404).json({
					message: 'Không tìm thấy phiên làm việc với ID này',
				});
			}
		} catch (error) {
			res.status(500).json({
				message: 'Lỗi khi lấy thông tin phiên làm việc',
				error: error.message,
			});
		}
	} else {
		res.status(400).json({
			message: 'ID phiên làm việc không được cung cấp',
		});
	}
};

const getListWorkSession = async (req, res) => {
	try {
		const listWorkSessions = await WorkSessionModel.find({ isDeleted: false });

		res.status(200).json({
			message: 'Lấy ra danh sách công việc thành công',
			data: listWorkSessions,
		});
	} catch (error) {
		res.status(400).json({
			message: error.message,
		});
	}
};

const createWorkSession = async (req, res) => {
	const {
		customer_id,
		employee_id,
		start_time,
		end_time,
		result = null,
		amount,
		payment_amount,
		before_images = [],
		after_images = [],
		maintenance_schedule = null,
		description,
	} = req.body;

	let calc_payment_amount = (amount * payment_amount) / 100;

	try {
		const newWorkSession = new WorkSessionModel({
			customer_id,
			employee_id,
			start_time,
			end_time,
			result,
			amount,
			payment_amount: calc_payment_amount,
			before_images,
			after_images,
			maintenance_schedule,
			description,
			status: 'assigned',
			rejection_reason: null,
			created_at: new Date(),
			updated_at: new Date(),
		});
		const savedWorkSession = await newWorkSession.save();

		return res.status(201).json({
			success: true,
			message: 'Phiên làm việc được tạo thành công',
			data: savedWorkSession,
		});
	} catch (error) {
		console.error('Đã xảy ra lỗi khi tạo phiên làm việc:', error);
		return res.status(500).json({
			success: false,
			message: 'Lỗi server',
			error: error.message,
		});
	}
};

const updateWorkSession = async (req, res) => {
	const { id } = req.query;
	const {
		customer_id,
		employee_id,
		start_time,
		end_time,
		result,
		before_images,
		after_images,
		maintenance_schedule,
		description,
		status,
		rejection_reason,
	} = req.body;

	// console.log(id);
	// console.log(result, status);

	if (id) {
		try {
			const updateWorkSession = await WorkSessionModel.findByIdAndUpdate(
				{ _id: id, isDeleted: false },
				{
					customer_id,
					employee_id,
					start_time,
					end_time,
					result,
					before_images,
					after_images,
					maintenance_schedule,
					description,
					status,
					rejection_reason,
				},
				{ new: true }
			);

			if (updateWorkSession) {
				res.status(200).json({
					message: 'Cập nhật thông tin phiên làm việc thành công',
					data: updateWorkSession,
				});
			} else {
				res.status(404).json({
					message: 'Phiên làm việc không tồn tại hoặc đã bị xóa',
				});
			}
		} catch (error) {
			res.status(500).json({
				message: 'Lỗi khi lấy thông tin phiên làm việc',
				error: error.message,
			});
		}
	} else {
		res.status(400).json({
			message: 'ID phiên làm việc không được cung cấp',
		});
	}
};

// const softDeleteWorkSession = async (req, res) => {
//   const { id } = req.query;

//   if (id) {
//     try {
//       const deletedWorkSession = await WorkSessionModel.findByIdAndUpdate(
//         id,
//         { isDeleted: true, deletedAt: Date.now() },
//         { new: true }
//       );

//       res.status(200).json({
//         message: "Xóa phiên làm việc thành công",
//         data: deletedWorkSession,
//       });
//     } catch (error) {
//       res.status(500).json({
//         message: "Lỗi khi xóa phiên làm việc",
//         error: error.message,
//       });
//     }
//   } else {
//     res.status(400).json({
//       message: "ID phiên làm việc không được cung cấp",
//     });
//   }
// };

const softDeleteWorkSession = async (req, res) => {
	const { id } = req.query;

	if (id) {
		try {
			// Xoá mềm phiên làm việc
			const deletedWorkSession = await WorkSessionModel.findByIdAndUpdate(
				id,
				{ isDeleted: true, deletedAt: Date.now() },
				{ new: true }
			);

			if (deletedWorkSession) {
				// Tìm và xoá mềm lịch bảo trì liên quan đến phiên làm việc này
				const deletedMaintenanceSchedule =
					await MaintenanceScheduleModel.findOneAndUpdate(
						{ work_session_id: id },
						{ isDeleted: true, deletedAt: Date.now() },
						{ new: true }
					);

				if (!deletedMaintenanceSchedule) {
					console.log('Phiên làm việc này chưa có lịch bảo trì.');
				}
			}

			res.status(200).json({
				message: 'Xóa phiên làm việc thành công, và lịch bảo trì (nếu có)',
				data: deletedWorkSession,
			});
		} catch (error) {
			res.status(500).json({
				message: 'Lỗi khi xóa phiên làm việc hoặc lịch bảo trì',
				error: error.message,
			});
		}
	} else {
		res.status(400).json({
			message: 'ID phiên làm việc không được cung cấp',
		});
	}
};

const getWorkSessionsByEmployeeId = async (req, res) => {
	const { employee_id } = req.query;

	if (employee_id) {
		try {
			const workSessions = await WorkSessionModel.find({
				employee_id,
				isDeleted: false,
			});

			if (workSessions.length > 0) {
				res.status(200).json({
					message: 'Lấy danh sách phiên làm việc thành công',
					data: workSessions,
				});
			} else {
				res.status(404).json({
					message: 'Không tìm thấy phiên làm việc với employee_id này',
				});
			}
		} catch (error) {
			res.status(500).json({
				message: 'Lỗi khi lấy danh sách phiên làm việc',
				error: error.message,
			});
		}
	} else {
		res.status(400).json({
			message: 'employee_id không được cung cấp',
		});
	}
};

const updateWorkSessionByAdmin = async (req, res) => {
	const { id } = req.query;
	const { amount, payment_amount } = req.body;

	let calc_payment_amount = (amount * payment_amount) / 100;

	if (id) {
		try {
			const updateWorkSession = await WorkSessionModel.findByIdAndUpdate(
				{ _id: id, isDeleted: false },
				{
					amount,
					payment_amount: calc_payment_amount,
				},
				{ new: true }
			);
			if (updateWorkSession) {
				res.status(200).json({
					message: 'Cập nhật thông tin phiên làm việc thành công',
					data: updateWorkSession,
				});
			} else {
				res.status(404).json({
					message: 'Phiên làm việc không tồn tại hoặc đã bị xóa',
				});
			}
		} catch (error) {
			res.status(500).json({
				message: 'Lỗi khi tìm kiếm thông',
				error: error.message,
			});
		}
	} else {
		res.status(400).json({
			message: 'Id phiên làm việc không được cung cấp',
		});
	}
};

const getMaintenanceSchedulers = async (req, res) => {
	const { date, limit } = req.query;

	try {
		const filter = date
			? {
					maintenance_schedule: {
						$gte: new Date(`${DateTime.CalendarDate(date)}T00:00:00z`),
						$lte: new Date(`${DateTime.CalendarDate(date)}T23:59:59.00z`),
					},
			  }
			: {};

		const works = await WorkSessionModel.find(filter)
			.limit(limit)
			.sort('maintenance_schedule');

		res.status(200).json({
			message: '',
			data: works,
		});
	} catch (error) {
		res.status(401).json({ message: error.message });
	}
};

export {
	getWorkSessionById,
	getListWorkSession,
	createWorkSession,
	updateWorkSession,
	softDeleteWorkSession,
	getWorkSessionsByEmployeeId,
	updateWorkSessionByAdmin,
	getMaintenanceSchedulers,
};
