import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  name: {
    type: String,
  },
  phone: {
    type: String,
  },
  username: {
    type: String,
  },
  role: {
    type: String,
    enum: ["admin", "employee"],
    required: true,
  },
  profilePicture: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const UserModel = mongoose.model("users", UserSchema);

export { UserModel };
