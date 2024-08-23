/** @format */

import mongoose from 'mongoose';

const WorkSessionSchema = new mongoose.Schema({
	customer_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'customers',
		required: true,
	},
	employee_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'users',
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
		type: Number,
		required: true,
	},
	payment_amount: {
		type: Number,
		required: true,
	},
	before_images: {
		// nó có thể là danh sách các ảnh trước khi làm
		type: [String],
		default: [],
	},
	after_images: {
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
		enum: ['assigned', 'accepted', 'pending', 'rejected', 'completed'],
		default: 'assigned',
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
		type: Date,
	},
	comments: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Comment',
	},
});

const WorkSessionModel = mongoose.model('workSessions', WorkSessionSchema);

export { WorkSessionModel };
