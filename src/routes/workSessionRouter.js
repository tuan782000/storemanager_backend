/** @format */

import express from 'express';
import {
	createWorkSession,
	getListWorkSession,
	getMaintenanceSchedulers,
	getWorkSessionById,
	getWorkSessionsByEmployeeId,
	softDeleteWorkSession,
	updateWorkSession,
	updateWorkSessionByAdmin,
} from '../controllers/workSessionController.js';

const workSessionRouter = express.Router();

workSessionRouter.post('/createWorkSession', createWorkSession);
workSessionRouter.get('/listWorkSessions', getListWorkSession);
workSessionRouter.get('/workSessionById', getWorkSessionById);
workSessionRouter.put('/updatedWorkSessionById', updateWorkSession);
workSessionRouter.put('/updateWorkSessionByAdmin', updateWorkSessionByAdmin);
workSessionRouter.delete('/softDeleteWorkSessionById', softDeleteWorkSession);
workSessionRouter.get(
	'/getWorkSessionsByEmployeeId',
	getWorkSessionsByEmployeeId
);
workSessionRouter.get('/maintenances', getMaintenanceSchedulers);

export { workSessionRouter };
