/** @format */

import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

const verifyToken = (req, res, next) => {
	const authorization = req.headers.authorization;
	const token = authorization && authorization.split(' ')[1];

	try {
		if (!token) {
			throw new Error('Unauthorization');
		}

		const verify = jwt.verify(token, process.env.SECRET_KEY);

		if (!verify) {
			throw new Error('invaled token');
		}

		req.id = verify.id;

		next();
	} catch (error) {
		res.status(401).json({
			message: error.message,
		});
	}
};

export default verifyToken;
