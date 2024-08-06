import express from "express";
import {
  editCustomerById,
  getCustomerById,
  getListCustomers,
  registerCustomer,
  softDeleteCustomer,
} from "../controllers/customerController.js";

const customerRouter = express.Router();

customerRouter.post("/registerCustomer", registerCustomer);
customerRouter.get("/listCustomer", getListCustomers);
customerRouter.get("/detailCustomer", getCustomerById);
customerRouter.put("/editCustomer", editCustomerById);
customerRouter.delete("/deleteCustomer", softDeleteCustomer);

export { customerRouter };
