import { UserModel } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const getJsonWebToken = async (email, id) => {
  const payload = {
    email,
    id,
  };
  const token = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });

  return token;
};

const register = async (req, res) => {
  const { email, password, role } = req.body;

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
  });

  await newUser.save();

  res.status(201).json({
    mess: "Đăng ký thành công",
    data: {
      email: newUser.email,
      id: newUser.id,
      accesstoken: await getJsonWebToken(email, newUser.id),
    },
  });
};

export { register };
