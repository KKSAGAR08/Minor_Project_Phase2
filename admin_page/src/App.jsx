import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppSidebarLayout from "./component/dashboard"; // This is the sidebar layout
import DashboardContent from "./component/dashboard1";
import Student from "./component/student";
import StudentDashboard from "./student_login_page/dashboard"
import StdDashboard from "./student_login_page/dashboard1"
import StdComplaints from "./student_login_page/stdcomplaints";
import StdFeePayment from "./student_login_page/feepayment.jsx"
import StdLeaveApplication from "./student_login_page/leaveapplication.jsx"
import StdLoginPage from "./authentication_folder/std_login_page.jsx"
import AdminLoginPage from "./authentication_folder/admin_login_page.jsx"
import NewStudentRegistration from "./component/student_registration.jsx"

// Uncomment or add more as needed
// import PaymentsContent from "./PaymentsContent";
// import ComplaintsContent from "./ComplaintsContent";
// import AttendanceContent from "./AttendanceContent";

export default function Routing_page() {
  return (
    <Router>
      <Routes>
        <Route path="/stdlogin" element={<StdLoginPage />}></Route>
        <Route path="/adminlogin" element={<AdminLoginPage />}></Route>
        <Route path="/admin" element={<AppSidebarLayout />}>
          <Route index element={<DashboardContent />} />
          <Route path="student" element={<Student />} />
          <Route path="std_register" element={<NewStudentRegistration />} />
        </Route>
        <Route path="/student" element={<StudentDashboard/>}>
          <Route index element={<StdDashboard />} />
          <Route path="payment" element={<StdFeePayment />} />
          <Route path="complaints" element={<StdComplaints />} />
          <Route path="leave" element={<StdLeaveApplication />} />
        </Route>
      </Routes>
    </Router>
  );
}
