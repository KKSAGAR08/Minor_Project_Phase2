import React from "react";
import {
  Home,
  Inbox,
  Search,
  Settings,
  Hotel,
  Wrench,
  MessageSquare,
  BadgeCheckIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"


function StdComplaints() {
  const complaints = [
    { id: 1, title: "AC not working", status: "in progress", date: "Dec 28, 2024" },
    { id: 2, title: "WiFi connectivity issues", status: "completed", date: "Dec 25, 2024" },
    { id: 3, title: "Water leakage in bathroom", status: "pending", date: "Dec 30, 2024"},
  ]
  return (
    <>
    <div className="py-2 w-full">
      <div className="flex justify-between items-center w-full">
        <div>
          <h2 className="text-2xl font-bold">Complaints</h2>
          <p className="text-muted-foreground">
            Track your complaints requests
          </p>
        </div>
        <Button>
          <MessageSquare className="h-4 w-4 mr-2" />
          New Complaint
        </Button>
      </div>
    </div>
    <Card>
      <CardContent className="p-0">
        <div className="divide-y">
            {complaints.map((complaint) => (
              <div key={complaint.id} className="p-6 flex items-center justify-between">
                  <div className="space-y-1">
                        <p className="font-medium">{complaint.title}</p>
                        <p className="text-sm text-muted-foreground">Submitted on {complaint.date}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                        <Badge variant={complaint.status === "pending"? "default":"outline"} >Pending</Badge>
                        <Badge variant={complaint.status === "in progress"? "default":"outline"} >In Progress</Badge>
                        <Badge variant={complaint.status === "completed"? "destructive":"outline"}
                        >
                          <BadgeCheckIcon/>
                          Completed
                          </Badge>
                  </div>
              </div>
            ))} 
          </div>
      </CardContent>
    </Card>
    </>
  );
}

export default StdComplaints;



