import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Home, Inbox, Search, Settings, Hotel, Wrench } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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
} from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { DataAPI } from "../lib/axiosInstance";
import toast, { Toaster } from "react-hot-toast";
import { UseLoader } from "../lib/loader";

function Dashboard1() {
  const [studentsCount, setStudentsCount] = useState();
  const [totalRoomsCount, setTotalRoomsCount] = useState(0);
  const [occupiedRooms, setOccupiedRooms] = useState([]);
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const { showLoader, hideLoader } = UseLoader();
  const [roomDetails, setRoomDetails] = useState({});

  const hostelOccupancyRate = totalRoomsCount
    ? ((occupiedRooms / totalRoomsCount) * 100).toFixed(2)
    : 0;

  function updateRoomData(rooms) {
    const updatedDetails = {
      one_sharing: {
        name: "one_sharing",
        available: 0,
        total: 0,
        occupied: 0,
      },
      two_sharing: {
        name: "two_sharing",
        available: 0,
        total: 0,
        occupied: 0,
      },
      three_sharing: {
        name: "three_sharing",
        available: 0,
        total: 0,
        occupied: 0,
      },
    };

    rooms.forEach((data) => {
      const type = data.room_type;

      const room = updatedDetails[type];

      room.total++;

      if (data.occupied) {
        room.occupied++;
      } else {
        room.available++;
      }
    });

    setRoomDetails(updatedDetails);
  }

  useEffect(() => {
    async function dashboardDetails() {
      try {
        showLoader();
        const res = await DataAPI.get("admin/profile/");

        setOccupiedRooms(res.data.occupied_rooms);
        setTotalRoomsCount(res.data.total_rooms);
        setStudentsCount(res.data.total_student_count);

        updateRoomData(res.data.rooms);
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

    dashboardDetails();
  }, []);

  useEffect(() => {
    async function fetchComplaint() {
      try {
        showLoader();
        const response = await DataAPI.get("admin/complaints/");

        const complaintsData = response.data.complaints;

        setComplaints(
          complaintsData.map((c, i) => ({
            id: i,
            usn: c.usn,
            title: c.title,
            room: c.roomno,
            student: c.std_name,
            date: new Date(c.created_at).toISOString().slice(0, 10),
            status: c.status,
            category: c.category,
            description: c.description,
          })),
        );

        setPendingCount(response.data.totalCount);
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

    fetchComplaint();
  }, []);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Student</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentsCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Occupancy Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(hostelOccupancyRate)}%
            </div>
            <Progress
              value={Math.floor(hostelOccupancyRate)}
              className="mt-2"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Pending Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">
              12 maintenance, 8 room changes, 4 complaints
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <span>Total Rooms</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRoomsCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>
              <h3 className="font-bold text-2xl">Room Availability</h3>
            </CardTitle>
            <CardDescription>Current room status by type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.values(roomDetails).map((type, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-sm">{type.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm">
                      <span className="font-medium">{type.available}</span>
                      <span className="text-muted-foreground">
                        /{type.total}
                      </span>
                    </div>
                    <Progress
                      value={(type.occupied / type.total) * 100}
                      className="w-24"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="">
            <Button className="w-full cursor-pointer" variant="outline">
              Manage Rooms
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <h3 className="font-bold text-2xl">Maintenance Requests</h3>
            </CardTitle>
            <CardDescription>Recent maintenance issues</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {complaints.slice(0, 5).map((request, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-2">
                    <Wrench className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{request.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Room {request.room}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      request.status === "Completed" ? "default" : "outline"
                    }
                  >
                    {request.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full cursor-pointer"
              onClick={() => navigate("maintenance")}
            >
              Manage Maintenance
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default Dashboard1;
