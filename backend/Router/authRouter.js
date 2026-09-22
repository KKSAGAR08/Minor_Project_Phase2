import express from "express";
import {
  adminLogin,
  studentLogin,
  protectRoute,
  registerPassword,
  setPassword,
  forgetpassword,
} from "../Controller/authController.js";

const Router = express.Router();

Router.route("/admin/login").post(adminLogin);
Router.route("/student/login").post(studentLogin);
Router.route("/student/registerpassword").post(registerPassword);
Router.route("/student/forgetpassword").post(forgetpassword);
Router.route("/student/setpassword/:id").post(setPassword);
Router.route("/protectRoute").get(protectRoute);

export default Router;
