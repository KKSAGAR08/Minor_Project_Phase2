import React, { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Inbox,
  Search,
  Settings,
  Hotel,
  Wrench,
  LogOut,
  UserPlus,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
import axios from "axios";

export default function AppSidebarLayout() {
  const items = [
    { title: "Dashboard", url: "/admin", icon: Home },
    { title: "Students", url: "student", icon: Inbox },
    { title: "Student Registration", url: "std_register", icon: UserPlus },
    { title: "Maintenance", url: "maintenance", icon: Settings },
  ];

  const [admin, setAdmin] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchStudentDetails() {
      try {
        const token1 = localStorage.getItem("token1");

        if (!token1) {
          console.warn("No token found, redirecting to login...");
          navigate("/adminlogin");
          return;
        }

        const response = await axios.get("http://localhost:3000/dashboard", {
          headers: {
            Authorization: `Bearer ${token1}`,
          },
        });
        console.log(response.data.username);
        setAdmin(response.data.username);
      } catch (error) {
        console.error("Error fetching student:", error);
      }
    }
    fetchStudentDetails();
  }, []);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-screen">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="mb-2 mt-1">
                <div className="w-full flex justify-center gap-3 items-center">
                  <Hotel className="flex" />
                  <h1 className="text-xl text-center font-bold ">
                    Hostel Admin
                  </h1>
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
                        className="focus:font-semibold focus:bg-gray-100"
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
                  <AvatarImage src="https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_3.png" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div className="flex flex-col justify-center">
                  <span className="text-sm font-medium">{admin}</span>
                </div>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => {
                        localStorage.removeItem("token1");
                        navigate("/adminlogin");
                      }}
                    >
                      <LogOut />
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Logout</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col p-4">
          <div className="flex items-center mb-4">
            <SidebarTrigger />
            <h1 className="text-lg font-bold">Dashboard</h1>
          </div>
          <hr />
          <div className="flex-1 p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
