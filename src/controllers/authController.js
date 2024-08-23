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
		const { username, password } = req.body;
		const checkExistingEmail = await UserModel.findOne({
			username,
			isDeleted: false,
		});

		if (!checkExistingEmail) {
			throw new Error('Tài khoản không tồn tại');
		}

		const isMatchPassword = await bcrypt.compare(
			password,
			checkExistingEmail.password
		);

		if (!isMatchPassword) {
			throw new Error(
				'Đăng nhập thất bại, vui lòng kiểm tra lại Tên đăng nhập hoặc mật khẩu và thử lại!!!'
			);
		}

		res.status(200).json({
			message: 'Đăng nhập thành công',

			data: {
				id: checkExistingEmail.id,
				email: checkExistingEmail.email,
				accesstoken: await getJsonWebToken(
					checkExistingEmail.email,
					checkExistingEmail.id
				),
			},
		});
	} catch (error) {
		res.status(404).json({
			message: error.message,
		});
	}
};

export { register, login };
