import React, { useState, useEffect } from "react";
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
import { weeklyMenu } from "../lib/messmenu";
import { DataAPI } from "../lib/axiosInstance";
import { UseLoader } from "../lib/loader";

function Dashboard1() {
  const [isavailable, setIsavailable] = useState(true);
  const [studentData, setStudentData] = useState("");
  const [roomateData, setRoomateData] = useState([]);
  const [pendingComplaint, setPendingComplaint] = useState(0);
  const [thisYearFee, setThisYearFee] = useState(0);
  const { showLoader, hideLoader } = UseLoader();

  useEffect(() => {
    async function fetchStudentDetails() {
      try {
        showLoader()
        const response = await DataAPI.get("studentdetails/");

        setStudentData(response.data.studentDetails);
        setIsavailable(response.data.availability);
        setRoomateData(response.data.roommates);
        setPendingComplaint(response.data.pendingComplaints);
        setThisYearFee(0);
        // setThisYearFee(()=>new Intl.NumberFormat("en-IN").format(response.data.currentYearFee));
      } catch (error) {
        console.error("Error fetching student:", error);
      }
      finally{
        hideLoader()
      }
    }
    fetchStudentDetails();
  }, []);

  const Today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  const TodayMenuDetails = weeklyMenu.find((e) => e.day === Today);

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
            <div className="text-2xl font-bold">{studentData.roomno}</div>
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
            <div className="text-2xl font-bold">₹ {thisYearFee}</div>
            <p className="text-xs text-muted-foreground">This year fee</p>
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
                <p className="text-lg font-semibold">{studentData.roomno}</p>
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
                    : "Single Sharing"}
                </p>
              </div>
            </div>
            <Separator />
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Roommate's</h3>
              <div className="grid gap-4 md:grid-cols-3">
                {roomateData.map((data, i) => (
                  <span key={i}>
                    <p className="font-medium">{data[1]}</p>
                    <p className="text-sm text-muted-foreground">{data[0]}</p>
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
            <CardDescription>{TodayMenuDetails.day}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-sm mb-2">Breakfast</h4>
              <p className="text-sm text-muted-foreground">
                {TodayMenuDetails.breakfast}
              </p>
            </div>
            <Separator />
            <div>
              <h4 className="font-medium text-sm mb-2">Lunch</h4>
              <p className="text-sm text-muted-foreground">
                {TodayMenuDetails.lunch}
              </p>
            </div>
            <Separator />
            <div>
              <h4 className="font-medium text-sm mb-2">Dinner</h4>
              <p className="text-sm text-muted-foreground">
                {TodayMenuDetails.dinner}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default Dashboard1;
