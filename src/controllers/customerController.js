import { CustomerModel } from "../models/customerModel.js";

const registerCustomer = async (req, res) => {
  const { email, name, phone, address } = req.body;

  const checkExistingEmail = await CustomerModel.findOne({ email });

  if (checkExistingEmail) {
    throw new Error("Email này đã tồn tại!!!");
  }

  const newCustomer = new CustomerModel({
    email,
    name,
    phone,
    address,
  });

  await newCustomer.save();

  res.status(201).json({
    mess: "Đăng ký khách hàng thành công",
    data: {
      email: newCustomer.email,
      name: newCustomer.name,
      phone: newCustomer.phone,
      address: newCustomer.address,
    },
  });
};

const getListCustomers = async (req, res) => {
  try {
    const customers = await CustomerModel.find({ isDeleted: false });

    res.status(200).json({
      message: "Lấy ra danh sách khách hàng thành công",
      data: customers,
    });
  } catch (error) {
    res.status(400).json({
      message: "Lấy ra danh sách khách hàng thành công",
      message: error.message,
    });
  }
};

const getCustomerById = async (req, res) => {
  const { id } = req.query;

  if (id) {
    try {
      const findCustomerById = await CustomerModel.findOne({
        _id: id,
      });
      if (findCustomerById) {
        res.status(200).json({
          message: "Lấy thông tin khách hàng thành công",
          data: findCustomerById,
        });
      } else {
        res.status(404).json({
          message: "Không tìm thấy khách hàng với ID này",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi lấy thông tin khách hàng",
        error: error.message,
      });
    }
  } else {
    res.status(400).json({
      message: "ID khách hàng không được cung cấp",
    });
  }
};

const editCustomerById = async (req, res) => {
  const { id } = req.query;
  const { email, name, phone, address } = req.body;

  if (id) {
    try {
      const updateCustomer = await CustomerModel.findByIdAndUpdate(
        id,
        { email, name, phone, address }, // Chỉ cập nhật các trường này
        { new: true } // Trả về tài liệu đã cập nhật)
      );
      res.status(200).json({
        message: "Cập nhật thông tin khách hàng thành công",
        data: updateCustomer,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi lấy thông tin khách hàng",
        error: error.message,
      });
    }
  } else {
    res.status(400).json({
      message: "ID khách hàng không được cung cấp",
    });
  }
};

const softDeleteCustomer = async (req, res) => {
  const { id } = req.query;

  if (id) {
    try {
      const deletedCustomer = await CustomerModel.findByIdAndUpdate(
        id,
        { isDeleted: true, deletedAt: Date.now() },
        { new: true }
      );

      res.status(200).json({
        message: "Xóa khách hàng thành công",
        data: deletedCustomer,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi xóa khách hàng",
        error: error.message,
      });
    }
  } else {
    res.status(500).json({
      message: "Lỗi khi lấy thông tin khách hàng",
      error: error.message,
    });
  }
};

export {
  registerCustomer,
  getListCustomers,
  getCustomerById,
  editCustomerById,
  softDeleteCustomer,
};
