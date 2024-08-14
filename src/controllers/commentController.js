import { CommentModel } from "../models/commentModel.js";
import { WorkSessionModel } from "../models/workSessionModel.js";

const getAllComment = async (req, res) => {
  try {
    const listComment = await CommentModel.find();

    res.status(200).json({
      message: "Lấy ra danh sách nhận xét thành công",
      data: listComment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách nhận xét",
      error: error.message,
    });
  }
};

const getComment = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      message: "ID phiên làm việc không được cung cấp",
    });
  }

  try {
    // Tìm các comment liên quan đến id
    const comment = await CommentModel.find({
      _id: id,
    });

    if (!comment) {
      return res.status(404).json({
        message: "Không tìm thấy phiên làm việc với ID này",
      });
    }

    res.status(200).json({
      message: "Lấy ra danh sách nhận xét thành công",
      data: comment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách nhận xét",
      error: error.message,
    });
  }
};

const createComment = async (req, res) => {
  const { comment, customer_id, employee_id, work_session_id } = req.body;

  if (!customer_id || !employee_id || !work_session_id || !comment) {
    return res.status(400).json({
      message: "Vui lòng cung cấp đầy đủ thông tin bắt buộc",
    });
  }

  try {
    // Tạo comment mới
    const newComment = new CommentModel({
      customer_id,
      employee_id,
      work_session_id,
      comment,
    });

    // Lưu comment vào cơ sở dữ liệu
    await newComment.save();

    // Cập nhật WorkSession để thêm comment vào danh sách comments
    await WorkSessionModel.findByIdAndUpdate(
      work_session_id,
      { $push: { comments: newComment._id } },
      { new: true }
    );

    res.status(201).json({
      message: "Thêm nhận xét thành công",
      data: newComment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi thêm nhận xét",
      error: error.message,
    });
  }
};

const updateComment = async (req, res) => {
  const { comment_id } = req.query;
  const { comment } = req.body;

  if (!comment_id) {
    return res.status(400).json({
      message: "ID nhận xét không được cung cấp",
    });
  }

  if (!comment) {
    return res.status(400).json({
      message: "Nội dung nhận xét không được để trống",
    });
  }

  try {
    // Tìm và cập nhật comment
    const updatedComment = await CommentModel.findByIdAndUpdate(
      comment_id,
      {
        comment,
        updated_at: Date.now(),
      },
      { new: true } // Trả về tài liệu đã cập nhật
    );

    if (!updatedComment) {
      return res.status(404).json({
        message: "Không tìm thấy nhận xét với ID này",
      });
    }

    res.status(200).json({
      message: "Cập nhật nhận xét thành công",
      data: updatedComment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi cập nhật nhận xét",
      error: error.message,
    });
  }
};

const softDeleteComment = async (req, res) => {};

export {
  getComment,
  createComment,
  updateComment,
  softDeleteComment,
  getAllComment,
};
