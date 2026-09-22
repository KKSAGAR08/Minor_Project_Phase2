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
import { DataAPI } from "../lib/axiosInstance";
import toast, { Toaster } from "react-hot-toast";
import { UseLoader } from "../lib/loader";
import { UseTheme } from "../lib/theme";
import { Switch } from "@/components/ui/switch";

export default function AppSidebarLayout() {
  const items = [
    { title: "Dashboard", url: "/admin", icon: Home },
    { title: "Students", url: "student", icon: Inbox },
    { title: "Student Registration", url: "std_register", icon: UserPlus },
    { title: "Maintenance", url: "maintenance", icon: Settings },
  ];

  const [admin, setAdmin] = useState("");
  const [Title, setTitle] = useState("Dashboard");
  const { showLoader, hideLoader } = UseLoader();
  const { theme, toggleTheme } = UseTheme();

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchStudentDetails() {
      try {
        showLoader();
        const token = localStorage.getItem("token");

        if (!token) {
          console.warn("No token found, redirecting to login...");
          navigate("/adminlogin");
          return;
        }

        const response = await DataAPI.get("admin/profile/");

        setAdmin(response.data.username);
      } catch (error) {
        const data = error.response?.data;

        if (data) {
          Object.values(data.messages).forEach((message) => {
            toast.error(message.message);
          });
        } else {
          toast.error(error);
        }
      } finally {
        hideLoader();
      }
    }
    fetchStudentDetails();
  }, []);

  useEffect(() => {
    const pahtName = location.pathname;
    const mathedPath = items.find((item) => {
      const itemPath = item.url.startsWith("/")
        ? item.url
        : `/admin/${item.url}`;
      return pahtName === itemPath;
    });

    if (mathedPath) {
      setTitle(mathedPath.title);
    } else {
      setTitle("Dashboard");
    }
  }, [location.pathname]);

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
                        className={`${
                          location.pathname === item.url ||
                          location.pathname ===
                            `/admin${
                              item.url.startsWith("/")
                                ? item.url
                                : `/${item.url}`
                            }`
                            ? theme != "dark"
                              ? "bg-gray-100 font-semibold"
                              : "bg-sidebar-accent font-semibold"
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
                        localStorage.removeItem("token");
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex">
              <SidebarTrigger />
              <h1 className="text-lg font-bold">{Title}</h1>
            </div>
            <div>
              <Switch
                checked={theme == "dark" ? true : false}
                onCheckedChange={toggleTheme}
                className="cursor-pointer"
              />
            </div>
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
