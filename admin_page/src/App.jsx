import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppSidebarLayout from "./component/dashboard"; // This is the sidebar layout
import DashboardContent from "./component/dashboard1";
import Student from "./component/student";
import StudentDashboard from "./student_login_page/dashboard";
import StdDashboard from "./student_login_page/dashboard1";
import StdComplaints from "./student_login_page/stdcomplaints";
import StdFeePayment from "./student_login_page/feepayment.jsx";
import StdLeaveApplication from "./student_login_page/leaveapplication.jsx";
import StdLoginPage from "./authentication_folder/std_login_page.jsx";
import AdminLoginPage from "./authentication_folder/admin_login_page.jsx";
import NewStudentRegistration from "./component/student_registration.jsx";
import AdminComplaint from "./component/complaints.jsx";
import HomePage from "./homePage.jsx";
import PasswordSet from "./student_login_page/passwordset.jsx";
import PasswordForm from "./components/ui/password-form.jsx";
import FingerprintRegister from "./student_login_page/fingerprint.jsx";
import { Toaster } from "react-hot-toast";

export default function Routing_page() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/stdlogin" element={<StdLoginPage />}></Route>
          <Route path="/adminlogin" element={<AdminLoginPage />}></Route>
          <Route
            path="/forgetpassword"
            element={
              <PasswordSet
                heading="Forget Password"
                subheading="Remembered your password? 👉 "
                url="forgetpassword"
              />
            }
          />
          <Route
            path="/registerpassword"
            element={
              <PasswordSet
                heading="Register New Password"
                subheading="Already Password Registered 👉 "
                url="registerpassword"
              />
            }
          />
          <Route path="/reset/:usn/:id" element={<PasswordForm />}></Route>
          <Route path="/admin" element={<AppSidebarLayout />}>
            <Route index element={<DashboardContent />} />
            <Route path="student" element={<Student />} />
            <Route path="std_register" element={<NewStudentRegistration />} />
            <Route path="maintenance" element={<AdminComplaint />} />
          </Route>
          <Route path="/student" element={<StudentDashboard />}>
            <Route index element={<StdDashboard />} />
            <Route path="payment" element={<StdFeePayment />} />
            <Route path="complaints" element={<StdComplaints />} />
            <Route path="leave" element={<StdLeaveApplication />} />
            <Route path="rg" element={<FingerprintRegister />} />
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </>
  );
}
