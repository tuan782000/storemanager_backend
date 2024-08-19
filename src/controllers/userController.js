/** @format */

import { UserModel } from '../models/userModel.js';
import bcrypt from 'bcrypt';
import { WorkSessionModel } from '../models/workSessionModel.js';
import _ from 'lodash';
import { HandleNotification } from '../utils/handleNotification.js';
import { serviceAccount } from '../serviceAccount.js';

const getUserWithId = async (req, res) => {
	const id = req.id;

	if (id) {
		try {
			const findUserById = await UserModel.findOne({
				_id: id,
				isDeleted: false,
			});
			if (findUserById) {
				res.status(200).json({
					message: 'Lấy thông tin nhân viên thành công',
					data: findUserById,
				});
			} else {
				res.status(404).json({
					message: 'Không tìm thấy nhân viên với ID này',
				});
			}
		} catch (error) {
			res.status(500).json({
				message: 'Lỗi khi lấy thông tin nhân viên',
				error: error.message,
			});
		}
	} else {
		res.status(400).json({
			message: 'ID nhân viên không được cung cấp',
		});
	}
};

const getListUsers = async (req, res) => {
	try {
		const users = await UserModel.find({ role: 'employee', isDeleted: false });

		res.status(200).json({
			message: 'Lấy ra danh sách nhân viên thành công',
			data: users,
		});
	} catch (error) {
		res.status(400).json({
			message: error.message,
		});
	}
};

const registerUser = async (req, res) => {
	const { email, password, role, username, name, phone, profilePicture } =
		req.body;

	const checkExistingEmail = await UserModel.findOne({ email });

	if (checkExistingEmail) {
		throw new Error('Email này đã tồn tại!!!');
	}

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	const newUser = new UserModel({
		email,
		password: hashedPassword,
		role,
		username,
		name,
		phone,
		profilePicture,
	});

	await newUser.save();

	res.status(201).json({
		mess: 'Đăng ký thành công',
		data: {
			email: newUser.email,
			id: newUser.id,
			role: newUser.role,
			username: newUser.username,
			name: newUser.name,
			phone: newUser.phone,
			profilePicture: newUser.profilePicture,
		},
	});
};

const editInfoUser = async (req, res) => {
	const { id } = req.query;
	const { name, phone } = req.body;

	if (id) {
		try {
			const updateUser = await UserModel.findByIdAndUpdate(
				{ _id: id, isDeleted: false },
				{ name, phone }, // Chỉ cập nhật các trường này
				{ new: true } // Trả về tài liệu đã cập nhật
			);
			if (updateUser) {
				res.status(200).json({
					message: 'Cập nhật thông tin nhân viên thành công',
					data: updateUser,
				});
			} else {
				res.status(404).json({
					message: 'Nhân viên không tồn tại hoặc đã bị xóa',
				});
			}
		} catch (error) {
			res.status(500).json({
				message: 'Lỗi khi lấy thông tin nhân viên',
				error: error.message,
			});
		}
	} else {
		res.status(400).json({
			message: 'ID nhân viên không được cung cấp',
		});
	}
};

const editInfoAvatar = async (req, res) => {
	const { id } = req.query;
	const { profilePicture } = req.body;

	if (id) {
		try {
			const updateAvatarUser = await UserModel.findByIdAndUpdate(
				{ _id: id, isDeleted: false },
				{ profilePicture }, // Chỉ cập nhật các trường này
				{ new: true } // Trả về tài liệu đã cập nhật
			);

			if (updateAvatarUser) {
				res.status(200).json({
					message: 'Cập nhật ảnh đại diện thành công',
					data: updateAvatarUser,
				});
			} else {
				res.status(404).json({
					message:
						'Cập nhật ảnh đại diện không thành công, vì nhân viên không tồn tại hoặc đã bị xoá',
				});
			}
		} catch (error) {
			res.status(500).json({
				message: 'Lỗi khi lấy thông tin nhân viên',
				error: error.message,
			});
		}
	} else {
		res.status(400).json({
			message: 'ID nhân viên không được cung cấp',
		});
	}
};

const editPassword = async (req, res) => {
	const { id } = req.query;
	const { password } = req.body;

	if (!password) {
		return res.status(400).json({
			message: 'Password không được để trống',
		});
	}

	if (password.length < 6) {
		return res.status(403).json({
			message: 'Password không được nhỏ hơn 6 ký tự',
		});
	}

	try {
		const salt = await bcrypt.genSalt(10);
		const hashedNewPassword = await bcrypt.hash(password, salt);

		if (id) {
			const updatedPassword = await UserModel.findByIdAndUpdate(
				{ _id: id, isDeleted: false },
				{
					password: hashedNewPassword,
				},
				{ new: true }
			);
			if (updatedPassword) {
				res.status(200).json({
					message: 'Cập nhật mật khẩu thành công',
					// Không nên trả về password đã hash trong response
					data: { id: updatedPassword._id, username: updatedPassword.username },
				});
			} else {
				res.status(404).json({
					message: 'Nhân viên không tồn tại hoặc đã bị xóa',
				});
			}
		} else {
			res.status(400).json({
				message: 'ID nhân viên không được cung cấp',
			});
		}
	} catch (error) {
		res.status(500).json({
			message: 'Lỗi khi cập nhật mật khẩu',
			error: error.message,
		});
	}
};

const softDeleteUser = async (req, res) => {
	const { id } = req.query;

	if (id) {
		try {
			const deletedUser = await UserModel.findByIdAndUpdate(
				id,
				{ isDeleted: true, deletedAt: Date.now() },
				{ new: true }
			);

			res.status(200).json({
				message: 'Xóa nhân viên thành công',
				data: deletedUser,
			});
		} catch (error) {
			res.status(500).json({
				message: 'Lỗi khi xóa nhân viên',
				error: error.message,
			});
		}
	} else {
		res.status(400).json({
			message: 'ID nhân viên không được cung cấp',
		});
	}
};

const getMoneyUserEarn = async (req, res) => {
	const { id } = req.query;

	if (!id) {
		return res.status(400).json({
			message: 'ID nhân viên không được cung cấp',
		});
	}

	try {
		const user = await UserModel.findById(id);

		if (!user) {
			return res.status(404).json({
				message: 'Người dùng không tồn tại',
			});
		}

		// Lấy ra danh sách công việc đã hoàn thành dựa vào role - dựa vào id của user
		let listWorkCompleted;

		if (user.role === 'admin') {
			listWorkCompleted = await WorkSessionModel.find({
				status: 'completed',
				isDeleted: false,
			});

			// Một vấn đề cần phải hỏi lại - người ta xoá cái đơn hoàn thành rồi thì có tính tổng tiền của cái đó không
			// hiện tại đang làm là không tính. - kể cả admin và user

			// tổng tiền cho admin
			const totalEarnings = _.sumBy(
				listWorkCompleted,
				(work) => work.amount - work.payment_amount
			);

			res.status(200).json({
				message: 'Tính toán thu nhập thành công',
				data: totalEarnings,
				// completedWorks: listWorkCompleted
			});
		} else if (user.role === 'employee') {
			listWorkCompleted = await WorkSessionModel.find({
				employee_id: id,
				status: 'completed',
				isDeleted: false,
			});

			// Tính tổng tiền cho employee
			const totalEarnings = _.sumBy(listWorkCompleted, 'payment_amount');

			res.status(200).json({
				message: 'Tính toán thu nhập thành công',
				data: totalEarnings,
				// completedWorks: listWorkCompleted
			});
		} else {
			return res.status(403).json({
				message: 'Bạn không có quyền truy cập thông tin này',
			});
		}
	} catch (error) {
		res.status(500).json({
			message: 'Đã có lỗi xảy ra',
			error: error.message,
		});
	}
};

// Nhược điểm của này các đơn có tạng thái hoàn thành thì xoá nó sẽ không được tính vào
const getMonthlyEarnings = async (req, res) => {
	const { id } = req.query;

	if (!id) {
		return res.status(400).json({
			message: 'ID nhân viên không được cung cấp',
		});
	}

	try {
		const user = await UserModel.findById(id);

		if (!user) {
			return res.status(404).json({
				message: 'Người dùng không tồn tại',
			});
		}

		const currentYear = new Date().getFullYear();
		const earningsByMonth = [];

		for (let month = 0; month < 12; month++) {
			const startDate = new Date(currentYear, month, 1);
			const endDate = new Date(currentYear, month + 1, 1);

			let listWorkCompleted;

			if (user.role === 'admin') {
				listWorkCompleted = await WorkSessionModel.find({
					status: 'completed',
					isDeleted: false,
					created_at: {
						$gte: startDate,
						$lt: endDate,
					},
				});

				const totalEarnings = _.sumBy(
					listWorkCompleted,
					(work) => work.amount - work.payment_amount
				);

				earningsByMonth.push({
					value: totalEarnings,
					frontColor: '#006DFF',
					gradientColor: '#009FFF',
					spacing: 20,
					label: `T-${('0' + (month + 1)).slice(-2)}`,
				});
			}

			// else if (user.role === "employee") {
			//   listWorkCompleted = await WorkSessionModel.find({
			//     employee_id: id,
			//     status: "completed",
			//     isDeleted: false,
			//     created_at: {
			//       $gte: startDate,
			//       $lt: endDate,
			//     },
			//   });

			//   const totalEarnings = _.sumBy(listWorkCompleted, "payment_amount");

			//   earningsByMonth.push({
			//     value: totalEarnings,
			//     frontColor: "#006DFF",
			//     gradientColor: "#009FFF",
			//     spacing: 20,
			//     label: `T-${("0" + (month + 1)).slice(-2)}`,
			//   });
			// }
			else {
				return res.status(403).json({
					message: 'Bạn không có quyền truy cập thông tin này',
				});
			}
		}

		res.status(200).json({
			message: 'Tính toán thu nhập theo tháng thành công',
			data: earningsByMonth,
		});
	} catch (error) {
		res.status(500).json({
			message: 'Đã có lỗi xảy ra',
			error: error.message,
		});
	}
};

const getMonthlyEarningAmounts = async (req, res) => {
	const { id } = req.query;

	if (!id) {
		return res.status(400).json({
			message: 'ID nhân viên không được cung cấp',
		});
	}

	try {
		const user = await UserModel.findById(id);

		if (!user) {
			return res.status(404).json({
				message: 'Người dùng không tồn tại',
			});
		}

		const currentYear = new Date().getFullYear();
		const earningsByMonth = [];

		for (let month = 0; month < 12; month++) {
			const startDate = new Date(currentYear, month, 1);
			const endDate = new Date(currentYear, month + 1, 1);

			let listWorkCompleted;

			if (user.role === 'admin') {
				listWorkCompleted = await WorkSessionModel.find({
					status: 'completed',
					isDeleted: false,
					created_at: {
						$gte: startDate,
						$lt: endDate,
					},
				});

				const totalEarnings = _.sumBy(listWorkCompleted, 'amount');

				earningsByMonth.push({
					value: totalEarnings,
					frontColor: '#006DFF',
					gradientColor: '#009FFF',
					spacing: 20,
					label: `T-${('0' + (month + 1)).slice(-2)}`,
				});
			}

			// else if (user.role === "employee") {
			//   listWorkCompleted = await WorkSessionModel.find({
			//     employee_id: id,
			//     status: "completed",
			//     isDeleted: false,
			//     created_at: {
			//       $gte: startDate,
			//       $lt: endDate,
			//     },
			//   });

			//   const totalEarnings = _.sumBy(listWorkCompleted, "payment_amount");

			//   earningsByMonth.push({
			//     value: totalEarnings,
			//     frontColor: "#006DFF",
			//     gradientColor: "#009FFF",
			//     spacing: 20,
			//     label: `T-${("0" + (month + 1)).slice(-2)}`,
			//   });
			// }
			else {
				return res.status(403).json({
					message: 'Bạn không có quyền truy cập thông tin này',
				});
			}
		}

		res.status(200).json({
			message: 'Tính toán thu nhập theo tháng thành công',
			data: earningsByMonth,
		});
	} catch (error) {
		res.status(500).json({
			message: 'Đã có lỗi xảy ra',
			error: error.message,
		});
	}
};
const getMonthlyEarningPaymentAmounts = async (req, res) => {
	const { id } = req.query;

	if (!id) {
		return res.status(400).json({
			message: 'ID nhân viên không được cung cấp',
		});
	}

	try {
		const user = await UserModel.findById(id);

		if (!user) {
			return res.status(404).json({
				message: 'Người dùng không tồn tại',
			});
		}

		const currentYear = new Date().getFullYear();
		const earningsByMonth = [];

		for (let month = 0; month < 12; month++) {
			const startDate = new Date(currentYear, month, 1);
			const endDate = new Date(currentYear, month + 1, 1);

			let listWorkCompleted;

			if (user.role === 'admin') {
				listWorkCompleted = await WorkSessionModel.find({
					status: 'completed',
					isDeleted: false,
					created_at: {
						$gte: startDate,
						$lt: endDate,
					},
				});

				const totalEarnings = _.sumBy(listWorkCompleted, 'payment_amount');

				earningsByMonth.push({
					value: totalEarnings,
					frontColor: '#006DFF',
					gradientColor: '#009FFF',
					spacing: 20,
					label: `T-${('0' + (month + 1)).slice(-2)}`,
				});
			}

			// else if (user.role === "employee") {
			//   listWorkCompleted = await WorkSessionModel.find({
			//     employee_id: id,
			//     status: "completed",
			//     isDeleted: false,
			//     created_at: {
			//       $gte: startDate,
			//       $lt: endDate,
			//     },
			//   });

			//   const totalEarnings = _.sumBy(listWorkCompleted, "payment_amount");

			//   earningsByMonth.push({
			//     value: totalEarnings,
			//     frontColor: "#006DFF",
			//     gradientColor: "#009FFF",
			//     spacing: 20,
			//     label: `T-${("0" + (month + 1)).slice(-2)}`,
			//   });
			// }
			else {
				return res.status(403).json({
					message: 'Bạn không có quyền truy cập thông tin này',
				});
			}
		}

		res.status(200).json({
			message: 'Tính toán thu nhập theo tháng thành công',
			data: earningsByMonth,
		});
	} catch (error) {
		res.status(500).json({
			message: 'Đã có lỗi xảy ra',
			error: error.message,
		});
	}
};

const updateFcmToken = async (req, res) => {
	const body = req.body;
	const id = req.id;
	try {
		const user = await UserModel.findById(id);

		if (!user.fcmtoken || user.fcmtoken !== body.token) {
			await UserModel.findByIdAndUpdate(id, {
				fcmtoken: body.token,
			});
		}

		res.status(200).json({
			message: 'Fcm token updated!!',
		});
	} catch (error) {
		res.status(404).json({
			message: error.message,
		});
	}
};

const testnotification = async (req, res) => {
	try {
		// console.log(serviceAccount.client_email, serviceAccount.private_key);
		const tokens = await HandleNotification.GetAccesstoken(
			serviceAccount.client_email,
			serviceAccount.private_key
		);

		// console.log(tokens);

		res.status(200).json({
			message: 'fafafa',
			data: tokens,
		});
	} catch (error) {
		res.status(404).json({
			message: error.message,
		});
	}
};

export {
	getUserWithId,
	editInfoUser,
	registerUser,
	editInfoAvatar,
	editPassword,
	getListUsers,
	softDeleteUser,
	getMoneyUserEarn,
	getMonthlyEarnings,
	getMonthlyEarningAmounts,
	getMonthlyEarningPaymentAmounts,
	updateFcmToken,
	testnotification,
};
