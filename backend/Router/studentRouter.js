import express from "express";
import { protectRoute } from "../Controller/authController.js";
import {
  addStudentComplaint,
  getAllTheFee,
  getStudentComplaint,
  studentCheckin,
  studentCheckout,
  studentDashboardDetails,
  updateStudentDetails,
} from "../Controller/studentController.js";
import AdminRouter from "../Router/adminRouter.js";
import { deleteComplaint } from "../Controller/adminController.js";



const Router = express.Router();

Router.route("/").get(protectRoute, studentDashboardDetails).post(protectRoute,updateStudentDetails);

Router.route("/attendence")
  .post(protectRoute, studentCheckout)
  .patch(protectRoute, studentCheckin);

Router.route("/complaints").post(protectRoute, addStudentComplaint);

Router.route("/complaints/:id").get(getStudentComplaint).delete(protectRoute,deleteComplaint);

Router.route("/payment/:usn").get(getAllTheFee);


export default Router;
