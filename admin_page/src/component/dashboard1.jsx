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
import axios from "axios";

function Dashboard1() {
  const [studentsCount, setStudentsCount] = useState();
  const [totalRooms, setTotalRooms] = useState([]);
  const [occupiedRooms, setOccupiedRooms] = useState([]);
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);

  const roomTypes = [
    {
      name: "Single Room",
      available: (totalRooms[0]?.count || 0) - (occupiedRooms[0]?.count || 0),
      total: totalRooms[0]?.count || 0,
      occupied: occupiedRooms[0]?.count || 0,
    },
    {
      name: "Double Room",
      available: (totalRooms[1]?.count || 0) - (occupiedRooms[1]?.count || 0),
      total: totalRooms[1]?.count || 0,
      occupied: occupiedRooms[1]?.count || 0,
    },
    {
      name: "Triple Room",
      available: (totalRooms[2]?.count || 0) - (occupiedRooms[2]?.count || 0),
      total: totalRooms[2]?.count || 0,
      occupied: occupiedRooms[2]?.count || 0,
    },
  ];

  const totalRoomCount = totalRooms.reduce((sum, r) => sum + (r.count || 0), 0);
  const totalOccupiedCount = occupiedRooms.reduce(
    (sum, r) => sum + (r.count || 0),
    0
  );

  const hostelOccupancyRate = totalRoomCount
    ? ((totalOccupiedCount / totalRoomCount) * 100).toFixed(2)
    : 0;

  const totalRoomCount1 = totalRooms.reduce((sum, r) => sum + Number(r.count || 0), 0);

  useEffect(() => {
    async function countStudent() {
      try {
        const res = await fetch("http://localhost:3000/admin_dashboard");
        const data = await res.json();
        setStudentsCount(data.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }

    countStudent();
  }, []);

  useEffect(() => {
    async function roomDetails() {
      try {
        const res = await fetch("http://localhost:3000/room_status");
        const { occupied_rooms, total_rooms } = await res.json();
        setOccupiedRooms(occupied_rooms);
        setTotalRooms(total_rooms);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }

    roomDetails();
  }, []);

  useEffect(() => {
    async function fetchComplaint() {
      try {
        const response = await axios.get(
          "http://localhost:3000/admin_complaint"
        );

        const complaintsData = response.data.complaints; // 👈 updated to access nested "complaints" key

        setComplaints(
          complaintsData.map((c) => ({
            id: c.id,
            usn: c.usn,
            title: c.title,
            room: c.room_no,
            student: c.student_name,
            date: new Date(c.date).toISOString().slice(0, 10),
            status: c.status,
            category: c.category,
            description: c.description,
          }))
        );

        setPendingCount(response.data.totalCount);
      } catch (error) {
        alert(
          "Error in Fetching data: " + error.response?.data?.message ||
            error.message
        );
      }
    }

    fetchComplaint();
  }, []);

  console.log(complaints);

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
            <div className="text-2xl font-bold">{Math.floor(hostelOccupancyRate)}%</div>
            <Progress value={Math.floor(hostelOccupancyRate)} className="mt-2" />
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
            <div className="text-2xl font-bold">{totalRoomCount1}</div>
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
              {roomTypes.map((type, index) => (
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
