import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

// const dbUrl = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@dienlanhvn2407.xanvnbu.mongodb.net/`;
const dbUrl = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@dienlanhvn2407.xanvnbu.mongodb.net/?retryWrites=true&w=majority&appName=Dienlanhvn2407`;

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(dbUrl);
    // console.log(connection.connection);
    console.log(`Connect to mongodb successfully!!!`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export { connectDB };
