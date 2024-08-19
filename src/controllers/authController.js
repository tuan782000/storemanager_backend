/** @format */

import { UserModel } from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const getJsonWebToken = async (email, id) => {
	const payload = {
		email,
		id,
	};
	const token = jwt.sign(payload, process.env.SECRET_KEY, {});

	return token;
};

const register = async (req, res) => {
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

const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		const checkExistingEmail = await UserModel.findOne({
			email,
			isDeleted: false,
		});
		//   console.log(checkExistingEmail);

		if (!checkExistingEmail) {
			return res.status(403).json({
				message: 'Vui lòng kiểm tra lại email hoặc password!!!',
			});
		}

		if (password.length < 6) {
			return res.status(403).json({
				message: 'Vui lòng kiểm tra lại email hoặc password!!!',
			});
		}

		const isMatchPassword = await bcrypt.compare(
			password,
			checkExistingEmail.password
		);

		if (!isMatchPassword) {
			return res.status(401).json({
				message: 'Vui lòng kiểm tra lại email hoặc password!!!',
			});
		}

		res.status(200).json({
			message: 'Đăng nhập thành công',
			data: {
				id: checkExistingEmail.id,
				email: checkExistingEmail.email,
				accesstoken: await getJsonWebToken(email, checkExistingEmail.id),
			},
		});
	} catch (error) {
		res.status(500).json({
			message: 'Đã xảy ra lỗi khi đăng nhập',
			error: error.message,
		});
	}
};

export { register, login };
