import express from "express";
import {
  getAllStudentsDetails,
  deleteStudent,
  checkBeforeAdding,
  addNewStudent,
  deleteComplaint,
  getAllComplaints,
  updateExistingComplaint,
  adminDashboardDetails,
  getAllStudentsPaymentDetails,
} from "../Controller/adminController.js";
import { protectRoute } from "../Controller/authController.js";

const Router = express.Router({ mergeParams: true });

Router.route("/").get(adminDashboardDetails);
Router.route("/payment").get(getAllStudentsPaymentDetails);
Router.route("/students")
  .get(getAllStudentsDetails)
  .post(protectRoute, checkBeforeAdding, addNewStudent);
Router.route("/students/:usn").delete(protectRoute, deleteStudent);
Router.route("/complaints").get(getAllComplaints);
Router.route("/complaints/:id")
  .delete(protectRoute, deleteComplaint)
  .patch(protectRoute, updateExistingComplaint);

export default Router;
