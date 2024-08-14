import { UserModel } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { WorkSessionModel } from "../models/workSessionModel.js";

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
          message: "Lấy thông tin nhân viên thành công",
          data: findUserById,
        });
      } else {
        res.status(404).json({
          message: "Không tìm thấy nhân viên với ID này",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi lấy thông tin nhân viên",
        error: error.message,
      });
    }
  } else {
    res.status(400).json({
      message: "ID nhân viên không được cung cấp",
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
        { _id: id, isDeleted: false },
        { name, phone }, // Chỉ cập nhật các trường này
        { new: true } // Trả về tài liệu đã cập nhật
      );
      if (updateUser) {
        res.status(200).json({
          message: "Cập nhật thông tin nhân viên thành công",
          data: updateUser,
        });
      } else {
        res.status(404).json({
          message: "Nhân viên không tồn tại hoặc đã bị xóa",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi lấy thông tin nhân viên",
        error: error.message,
      });
    }
  } else {
    res.status(400).json({
      message: "ID nhân viên không được cung cấp",
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
          message: "Cập nhật ảnh đại diện thành công",
          data: updateAvatarUser,
        });
      } else {
        res.status(404).json({
          message:
            "Cập nhật ảnh đại diện không thành công, vì nhân viên không tồn tại hoặc đã bị xoá",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi lấy thông tin nhân viên",
        error: error.message,
      });
    }
  } else {
    res.status(400).json({
      message: "ID nhân viên không được cung cấp",
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
        { _id: id, isDeleted: false },
        {
          password: hashedNewPassword,
        },
        { new: true }
      );
      if (updatedPassword) {
        res.status(200).json({
          message: "Cập nhật mật khẩu thành công",
          // Không nên trả về password đã hash trong response
          data: { id: updatedPassword._id, username: updatedPassword.username },
        });
      } else {
        res.status(404).json({
          message: "Nhân viên không tồn tại hoặc đã bị xóa",
        });
      }
    } else {
      res.status(400).json({
        message: "ID nhân viên không được cung cấp",
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
        message: "Xóa nhân viên thành công",
        data: deletedUser,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi xóa nhân viên",
        error: error.message,
      });
    }
  } else {
    res.status(400).json({
      message: "ID nhân viên không được cung cấp",
    });
  }
};

// const getMoneyUserEarn = async (req, res) => {
//   const { id } = req.query;

//   if (id) {
//     try {
//       const user = await UserModel.findById(id);

//       console.log(user);

//       if (!user) {
//         return res.status(404).json({
//           message: "Người dùng không tồn tại",
//         });
//       }

//       const role = user.role;

//       console.log(role);

//       // nếu là nhân viên payment_amount - còn admin sẽ là amount
//       // Determine the field to sum and the multiplier based on the role
//       let fieldToSum;
//       let multiplier;

//       if (role === "employee") {
//         fieldToSum = "payment_amount";
//         multiplier = 1; // Employees get 100% of payment_amount
//       } else if (role === "admin") {
//         fieldToSum = "amount";
//         multiplier = 0.7; // Admins get 70% of the amount
//       }

//       console.log(fieldToSum, multiplier);

//       const userEarnings = await WorkSessionModel.aggregate([
//         {
//           $match: {
//             employee_id: mongoose.Types.ObjectId(id),
//             status: "completed",
//             isDeleted: false,
//           },
//         },
//         {
//           $group: {
//             _id: null,
//             totalEarnings: {
//               $sum: { $multiply: [`$${fieldToSum}`, multiplier] },
//             },
//           },
//         },
//       ]);

//       console.log(userEarnings);

//       const totalEarnings =
//         userEarnings.length > 0 ? userEarnings[0].totalEarnings : 0;

//       res.status(200).json({
//         message: "Tính toán thu nhập thành công",
//         totalEarnings,
//       });

//       // const userEarnings = await WorkSessionModel.aggregate([]);
//     } catch (error) {
//       res.status(500).json({
//         message: "Đã có lỗi xảy ra",
//         error: error.message,
//       });
//     }
//   } else {
//     res.status(400).json({
//       message: "ID nhân viên không được cung cấp",
//     });
//   }
// };

const getMoneyUserEarn = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      message: "ID nhân viên không được cung cấp",
    });
  }

  try {
    const user = await UserModel.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "Người dùng không tồn tại",
      });
    }

    const role = user.role;
    let fieldToSum, multiplier, matchCondition;

    console.log(user, role, fieldToSum, multiplier, matchCondition);

    if (role === "employee") {
      fieldToSum = "payment_amount";
      multiplier = 1; // Employees get 100% of payment_amount
      matchCondition = {
        employee_id: id,
        status: "completed",
        isDeleted: false,
      };
    } else if (role === "admin") {
      fieldToSum = "amount";
      multiplier = 0.7; // Admins get 70% of the amount
      matchCondition = {
        status: "completed",
        isDeleted: false,
      };
    }

    console.log(user, role, fieldToSum, multiplier, matchCondition);

    const userEarnings = await WorkSessionModel.aggregate([
      {
        $match: matchCondition,
      },
      {
        $group: {
          _id: null,
          totalEarnings: {
            $sum: { $multiply: [`$${fieldToSum}`, multiplier] },
          },
        },
      },
    ]);

    const totalEarnings =
      userEarnings.length > 0 ? userEarnings[0].totalEarnings : 0;

    res.status(200).json({
      message: "Tính toán thu nhập thành công",
      totalEarnings,
    });
  } catch (error) {
    res.status(500).json({
      message: "Đã có lỗi xảy ra",
      error: error.message,
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
};
