import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Home,
  Inbox,
  Search,
  Settings,
  Hotel,
  Wrench,
  FileText,
  CreditCard,
  Wifi,
  House,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarProvider,
  SidebarTrigger,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function Dashboard1() {
  const [isavailable, setIsavailable] = useState(true);
  const [studentData, setStudentData] = useState("");
  const [roomateData, setRoomateData] = useState([]);
  const [pendingComplaint, setPendingComplaint] = useState(0);

  useEffect(() => {
    async function fetchStudentDetails() {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "https://minor-project-phase2.onrender.com/student_dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStudentData(response.data.studentDetails);
        setIsavailable(response.data.availability.isavailable)
      } catch (error) {
        console.error("Error fetching student:", error);
      }
    }
    fetchStudentDetails();
  }, []);

  useEffect(() => {
    async function fetchStudentRoomate() {
      try {
        const response = await axios.post(
          "https://minor-project-phase2.onrender.com/student_roommates",
          { usn: studentData.usn }
        );
        setRoomateData(response.data);
      } catch (error) {
        console.error("Error fetching student:", error);
      }
    }
    fetchStudentRoomate();
  }, [studentData]);

  console.log(roomateData);

  useEffect(() => {
    async function countPendingComplaints() {
      try {
        const response = await axios.post(
          "https://minor-project-phase2.onrender.com/count_pending_complaints",
          { usn: studentData.usn }
        );

        setPendingComplaint(response.data.count);
      } catch (error) {
        console.error("Error fetching student:", error);
      }
    }
    countPendingComplaints();
  }, [studentData]);

  const messMenu = {
    today: "Thursday",
    meals: {
      breakfast: ["Oatmeal", "Toast", "Fresh Fruits", "Coffee/Tea"],
      lunch: ["Rice", "Dal", "Chicken Curry", "Vegetables", "Salad"],
      dinner: ["Pasta", "Garlic Bread", "Soup", "Ice Cream"],
    },
  };


  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex justify-between">
              Room Number
              <House />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentData.room_no}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex justify-between">
              Pending Requests
              <FileText />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingComplaint}</div>
            <p className="text-xs text-muted-foreground">
              1 Completed Complaints, 2 In Progress Complaints, 1 Pending
              Complaints
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex justify-between">
              Pending Payments
              <CreditCard />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹ 24</div>
            <p className="text-xs text-muted-foreground">1 payment due</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <span>Availability Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isavailable ? (
                <div className="text-green-600">In Hostel</div>
              ) : (
                <div className="text-red-600">Out of Hostel</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              Room Information
            </CardTitle>
            <CardDescription>
              Your current room details and occupancy
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Room Number</label>
                <p className="text-lg font-semibold">{studentData.room_no}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Block</label>
                <p className="text-lg font-semibold">Block A</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Floor</label>
                <p className="text-lg font-semibold">2nd Floor</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Room Type</label>
                <p className="text-lg font-semibold">
                  {roomateData.length > 0
                    ? `${roomateData[0].room_type} Sharing`
                    : "Loading..."}
                </p>
              </div>
            </div>
            <Separator />
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Roommate's</h3>
              <div className="grid gap-4 md:grid-cols-3">
                {roomateData.map((request) => (
                  <span>
                    <p className="font-medium">{request.roommate_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {request.student_mobile_no}
                    </p>
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              Today's Menu
            </CardTitle>
            <CardDescription>{messMenu.today}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-sm mb-2">Breakfast</h4>
              <p className="text-sm text-muted-foreground">
                {messMenu.meals.breakfast.join(", ")}
              </p>
            </div>
            <Separator />
            <div>
              <h4 className="font-medium text-sm mb-2">Lunch</h4>
              <p className="text-sm text-muted-foreground">
                {messMenu.meals.lunch.join(", ")}
              </p>
            </div>
            <Separator />
            <div>
              <h4 className="font-medium text-sm mb-2">Dinner</h4>
              <p className="text-sm text-muted-foreground">
                {messMenu.meals.dinner.join(", ")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default Dashboard1;
