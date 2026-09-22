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
  Camera,
  LoaderCircle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
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
import { DataAPI } from "../lib/axiosInstance";
import { UseTheme } from "../lib/theme";
import { UseLoader } from "../lib/loader";

export default function AppSidebarLayout() {
  const location = useLocation();
  const [Title, setTitle] = useState("Dashboard");
  const [studentData, setStudentData] = useState({});
  const [updateStudentData, setUpdateStudentData] = useState({});
  const [open, setOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const { theme, toggleTheme } = UseTheme();
  const { showLoader, hideLoader } = UseLoader();

  useEffect(() => {
    setUpdateStudentData(studentData);
  }, [studentData]);

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
      const token = localStorage.getItem("token");
      try {
        showLoader();
        if (!token) {
          console.warn("No token found, redirecting to login...");
          navigate("/stdlogin");
          return;
        }

        const response = await DataAPI.get("studentdetails/");
        setStudentData(response.data.studentDetails);
      } catch (error) {
        console.error("Error fetching student:", error);
      } finally {
        hideLoader();
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

  async function handleSubmit(e) {
    showLoader();

    let updateDate = { ...updateStudentData };

    delete updateDate.usn;
    delete updateDate.std_email;
    delete updateDate.roomno;

    if (updateDate.profile_pic === studentData.profile_pic) {
      delete updateDate.profile_pic;
    }

    e.preventDefault();

    try {
      const formData = new FormData();

      Object.entries(updateDate).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await DataAPI.patch("studentdetails/", formData);

      setStudentData(response.data);
      setOpen(false);
    } catch (error) {
      console.error("Error fetching student:", error);
    } finally {
      hideLoader();
    }
  }

  function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUpdateStudentData((val) => ({ ...val, profile_pic: file }));

    const localUrl = URL.createObjectURL(file);
    setSelectedImg(localUrl);
  }

  return (
    <>
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
                              ? theme != "dark"
                                ? "bg-gray-100 font-semibold"
                                : "bg-sidebar-accent font-semibold"
                              : ""
                          }`}
                        >
                          <Link
                            to={item.url}
                            className="flex items-center gap-2"
                          >
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
            <SidebarFooter>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="cursor-pointer bg-blue-500 hover:bg-blue-600">
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-11/12 max-w-md sm:mx-auto max-h-[80vh] flex flex-col rounded-xl">
                  <DialogHeader className="flex-shrink-0">
                    <DialogTitle className="text-center text-xl font-semibold">
                      Edit Profile Information
                    </DialogTitle>
                    <DialogDescription>
                      you can edit your information here
                    </DialogDescription>
                  </DialogHeader>

                  <div className="flex-1 overflow-y-auto pr-2">
                    <form
                      id="edit-profile-form"
                      onSubmit={handleSubmit}
                      className="space-y-6"
                    >
                      {/* Centered Avatar */}
                      <div className="relative w-fit mx-auto">
                        <img
                          className="size-20 rounded-full"
                          src={
                            selectedImg ||
                            studentData.profile_pic ||
                            "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_35.png"
                          }
                          alt="avatar"
                        />

                        {/* Camera overlay button */}
                        <label
                          htmlFor="avatarUpload"
                          className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow cursor-pointer"
                        >
                          <Camera className="size-4 text-gray-600" />
                        </label>

                        {/* Hidden file input */}
                        <input
                          id="avatarUpload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImage}
                        />
                      </div>

                      {/* Form Fields */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            autoFocus
                            value={updateStudentData.std_name}
                            onChange={(e) =>
                              setUpdateStudentData((val) => ({
                                ...val,
                                std_name: e.target.value,
                              }))
                            }
                            required
                            placeholder="Enter your name"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="usn">USN</Label>
                          <Input
                            id="usn"
                            disabled
                            defaultValue={updateStudentData.usn}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            disabled
                            defaultValue={updateStudentData.std_email}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="father-name">Father's Name</Label>
                          <Input
                            id="father-name"
                            required
                            value={updateStudentData.std_fname}
                            onChange={(e) =>
                              setUpdateStudentData((val) => ({
                                ...val,
                                std_fname: e.target.value,
                              }))
                            }
                            placeholder="Enter father's name"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="mother-name">Mother's Name</Label>
                          <Input
                            id="mother-name"
                            required
                            value={updateStudentData.std_mname}
                            onChange={(e) =>
                              setUpdateStudentData((val) => ({
                                ...val,
                                std_mname: e.target.value,
                              }))
                            }
                            placeholder="Enter mother's name"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="mobile">Mobile Number</Label>
                          <Input
                            id="mobile"
                            type="number"
                            required
                            value={updateStudentData.mobile_no}
                            onChange={(e) =>
                              setUpdateStudentData((val) => ({
                                ...val,
                                mobile_no: e.target.value,
                              }))
                            }
                            placeholder="Enter mobile number"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="address">Permanent Address</Label>
                          <Textarea
                            id="address"
                            required
                            value={updateStudentData.address}
                            onChange={(e) =>
                              setUpdateStudentData((val) => ({
                                ...val,
                                address: e.target.value,
                              }))
                            }
                            placeholder="Enter permanent address"
                            rows={3}
                          />
                        </div>
                      </div>
                    </form>
                  </div>

                  <div className="flex gap-3 pt-4 border-t flex-shrink-0">
                    <Button
                      type="button"
                      variant="outline"
                      // onClick={handleCancel}
                      className="flex-1 bg-transparent cursor-pointer"
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </Button>

                    <Button
                      type="submit"
                      form="edit-profile-form"
                      className="flex-1 cursor-pointer"
                    >
                      Submit
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </SidebarFooter>
            <SidebarFooter className="border-t p-4">
              <div className="flex items-center gap-2 justify-between">
                <div className="flex gap-2">
                  <Avatar>
                    <AvatarImage
                      src={
                        studentData.profile_pic ||
                        "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_35.png"
                      }
                    />
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {studentData.std_name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ID: {studentData.usn}
                    </span>
                  </div>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
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
              <div className="flex gap-4 items-center">
                <Switch
                  checked={theme == "dark" ? true : false}
                  onCheckedChange={toggleTheme}
                  className="cursor-pointer"
                />
                <Dialog>
                  <DialogTrigger asChild>
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
                            <AvatarImage
                              src={
                                studentData.profile_pic ||
                                "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_35.png"
                              }
                            />
                            <AvatarFallback>
                              {studentData.std_name
                                ? getInitials(studentData.std_name)
                                : "NA"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <h3 className="text-xl font-semibold">
                              {studentData.std_name}
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
                            <p className="text-sm">{studentData.std_fname}</p>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Mother's Name
                            </label>
                            <p className="text-sm">{studentData.std_mname}</p>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <p className="text-sm">{studentData.std_email}</p>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Phone</label>
                            <p className="text-sm">{studentData.mobile_no}</p>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Room</label>
                            <p className="text-sm">{studentData.roomno}</p>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Permanent Address
                            </label>
                            <p className="text-sm">{studentData.address}</p>
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
              <Outlet context={{ studentData }} />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </>
  );
}
