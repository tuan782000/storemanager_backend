import { UserModel } from "../models/userModel.js";
import bcrypt from "bcrypt";

const getUserWithId = async (req, res) => {
  const { id } = req.query;

  if (id) {
    try {
      const findUserById = await UserModel.findOne({
        _id: id,
        isDeleted: false,
      });
      if (findUserById) {
        res.status(200).json({
          message: "Lấy thông tin người dùng thành công",
          data: findUserById,
        });
      } else {
        res.status(404).json({
          message: "Không tìm thấy người dùng với ID này",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi lấy thông tin người dùng",
        error: error.message,
      });
    }
  } else {
    res.status(400).json({
      message: "ID người dùng không được cung cấp",
    });
  }
};

const getListUsers = async (req, res) => {
  try {
    const users = await UserModel.find({ role: "employee", isDeleted: false });

    res.status(200).json({
      message: "Lấy ra danh sách nhân viên thành công",
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
    throw new Error("Email này đã tồn tại!!!");
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
    mess: "Đăng ký thành công",
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
        id,
        { name, phone }, // Chỉ cập nhật các trường này
        { new: true } // Trả về tài liệu đã cập nhật
      );
      res.status(200).json({
        message: "Cập nhật thông tin người dùng thành công",
        data: updateUser,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi lấy thông tin người dùng",
        error: error.message,
      });
    }
  } else {
    res.status(400).json({
      message: "ID người dùng không được cung cấp",
    });
  }
};

const editInfoAvatar = async (req, res) => {
  const { id } = req.query;
  const { profilePicture } = req.body;

  if (id) {
    try {
      const updateAvatarUser = await UserModel.findByIdAndUpdate(
        id,
        { profilePicture }, // Chỉ cập nhật các trường này
        { new: true } // Trả về tài liệu đã cập nhật
      );
      res.status(200).json({
        message: "Cập nhật ảnh đại diện thành công",
        data: updateAvatarUser,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi lấy thông tin người dùng",
        error: error.message,
      });
    }
  } else {
    res.status(400).json({
      message: "ID người dùng không được cung cấp",
    });
  }
};

const editPassword = async (req, res) => {
  const { id } = req.query;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      message: "Password không được để trống",
    });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(password, salt);

    if (id) {
      const updatedPassword = await UserModel.findByIdAndUpdate(
        id,
        {
          password: hashedNewPassword,
        },
        { new: true }
      );
      res.status(200).json({
        message: "Cập nhật mật khẩu thành công",
        // Không nên trả về password đã hash trong response
        data: { id: updatedPassword._id, username: updatedPassword.username },
      });
    } else {
      res.status(400).json({
        message: "ID người dùng không được cung cấp",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi cập nhật mật khẩu",
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
        message: "Xóa người dùng thành công",
        data: deletedUser,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi xóa người dùng",
        error: error.message,
      });
    }
  } else {
    res.status(400).json({
      message: "ID người dùng không được cung cấp",
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
};
