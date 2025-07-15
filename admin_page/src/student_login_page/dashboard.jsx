import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Home,
  Inbox,
  Search,
  Settings,
  Hotel,
  Wrench,
  CreditCard as CreditCardIcon,
  PlaneTakeoff,
  LogOut,
  UserRound,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import axios from "axios";

export default function AppSidebarLayout() {
  const location = useLocation();
  const [Title, setTitle] = useState("Dashboard");
  const [studentData, setStudentData] = useState("");

  const items = [
    { title: "Dashboard", url: "/student", icon: Home, title2: "Dashboard" },
    {
      title: "Payment",
      url: "payment",
      icon: CreditCardIcon,
      title2: "Payment Details",
    },
    {
      title: "Maintenance",
      url: "complaints",
      icon: Settings,
      title2: "Complaints Details",
    },
    {
      title: "Leave Application",
      url: "leave",
      icon: PlaneTakeoff,
      title2: "Leave Details",
    },
  ];

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchStudentDetails() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.warn("No token found, redirecting to login...");
          navigate("/stdlogin");
          return;
        }

        const response = await axios.get(
          "https://minor-project-phase2.onrender.com/student_dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStudentData(response.data);
      } catch (error) {
        console.error("Error fetching student:", error);
      }
    }
    fetchStudentDetails();
  }, []);

  useEffect(() => {
    const currentPath = location.pathname;
    const matchedItem = items.find((item) => {
      const itemPath = item.url.startsWith("/")
        ? item.url
        : `/student/${item.url}`;
      return currentPath === itemPath;
    });

    if (matchedItem) {
      setTitle(matchedItem.title2);
    } else {
      setTitle("Dashboard");
    }
  }, [location.pathname]);

  function getInitials(name) {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-screen">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="mb-2 mt-1">
                <div className="w-full flex justify-center gap-3 items-center">
                  <Hotel className="flex" />
                  <h1 className="text-xl text-center font-bold ">Students</h1>
                </div>
              </SidebarGroupLabel>
              <hr className="shadow-2xl" />

              <SidebarGroupContent>
                <SidebarGroupLabel className="my-1 text-sm">
                  Main
                </SidebarGroupLabel>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`${
                          location.pathname === item.url ||
                          location.pathname ===
                            `/student${
                              item.url.startsWith("/")
                                ? item.url
                                : `/${item.url}`
                            }`
                            ? "bg-gray-100 font-semibold"
                            : ""
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-2">
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <div className="flex items-center gap-2 justify-between">
              <div className="flex gap-2">
                <Avatar>
                  <AvatarImage src="https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_35.png" />
                  <AvatarFallback>
                    {studentData.student_name
                      ? getInitials(studentData.student_name)
                      : "NA"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {studentData.student_name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ID: {studentData.usn}
                  </span>
                </div>
              </div>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => {
                      localStorage.removeItem("token");
                      navigate("/stdlogin"); // or wherever your login page is
                    }}
                  >
                    <LogOut />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Logout</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col p-4">
          <div className="flex items-center mb-4 justify-between">
            <div className="flex">
              <SidebarTrigger />
              <h1 className="text-lg font-bold">{Title}</h1>
            </div>
            <div>
              <Dialog>
                <DialogTrigger>
                  <Button variant="outline" className="cursor-pointer">
                    <UserRound /> View Profile
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        <p className="text-2xl">Profile Information</p>
                      </CardTitle>
                      <CardDescription>
                        <p className="text-muted-foreground">
                          Your personal details and contact information
                        </p>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center space-x-4 ">
                        <Avatar>
                          <AvatarImage src="https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_35.png" />
                          <AvatarFallback>
                            {studentData.student_name
                              ? getInitials(studentData.student_name)
                              : "NA"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <h3 className="text-xl font-semibold">
                            {studentData.student_name}
                          </h3>
                          <p className="text-muted-foreground">
                            {studentData.usn}
                          </p>
                        </div>
                      </div>
                      <Separator />
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Father's Name
                          </label>
                          <p className="text-sm">
                            {studentData.student_father_name}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Mother's Name
                          </label>
                          <p className="text-sm">
                            {studentData.student_mother_name}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Email</label>
                          <p className="text-sm">{studentData.student_email}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Phone</label>
                          <p className="text-sm">
                            {studentData.student_mobile_no}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Room</label>
                          <p className="text-sm">{studentData.room_no}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Parmanent Address
                          </label>
                          <p className="text-sm">
                            {studentData.permanent_address}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <hr />
          <div className="flex-1 p-4 md:p-6">
            <Outlet context={{studentData}} />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
