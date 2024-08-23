/** @format */

import express from 'express';
import cors from 'cors';
import { authRouter } from './src/routes/authRouter.js';
import { connectDB } from './src/configs/connectDB.js';
import { userRouter } from './src/routes/userRouter.js';
import { customerRouter } from './src/routes/customerRouter.js';
import { workSessionRouter } from './src/routes/workSessionRouter.js';
import { commentRouter } from './src/routes/commentRouter.js';
import { maintenanceScheduleRouter } from './src/routes/maintenanceScheduleRouter.js';
import verifyToken from './src/middlewares/verifyToken.js';

const app = express();

app.use(express.json());
app.use(cors());

const PORT = 3001;

app.use('/auth', authRouter);

app.use(verifyToken);
app.use('/user', userRouter);
app.use('/customer', customerRouter);
app.use('/worksession', workSessionRouter);
app.use('/comment', commentRouter);
app.use('/maintenanceSchedule', maintenanceScheduleRouter);

// app.use(errorMiddleHandle);

connectDB()
	.then(() => {
		app.listen(PORT, (err) => {
			if (err) {
				console.log(err);
				return;
			}

			console.log(`Server running http://localhost:${PORT}`);
		});
	})
	.catch((error) => {
		console.log(error);
	});
