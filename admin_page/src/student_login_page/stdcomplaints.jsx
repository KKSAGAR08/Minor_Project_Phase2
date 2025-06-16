import React, { useState, useEffect } from "react";
import {
  BadgeCheckIcon
} from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";

function StdComplaints() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [complaint, setComplaint] = useState([]);

  // Fetch student details first
  useEffect(() => {
    async function fetchStudentDetails() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:3000/student_dashboard",
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

  // Fetch complaints AFTER studentData is available
  useEffect(() => {
    async function fetchComplaint() {
      if (!studentData?.usn) return;

      try {
        const response = await axios.post(
          "http://localhost:3000/student_complaint_details",
          { usn: studentData.usn }
        );

        setComplaint(
          response.data.map((c) => ({
            id: c.id,
            title: c.title,
            date: c.date.split("T")[0], // FIXED typo from c.data to c.date
            status: c.status,
          }))
        );
      } catch (error) {
        console.error("Error fetching complaints:", error);
        alert("Error in Fetching data: " + error.message);
      }
    }

    fetchComplaint();
  }, [studentData]);


  async function handleSubmit() {
    try {
      const newComplaint = {
        roomno: studentData.room_no,
        usn: studentData.usn,
        title,
        category,
        description,
        status: "Pending",
        date: new Date().toISOString().split("T")[0],
      };

      const response = await axios.post(
        "http://localhost:3000/add_student_complaint",
        newComplaint
      );

      alert("Complaint submitted successfully: " + response.data.message);

      // Reset fields
      setTitle("");
      setCategory("");
      setDescription("");

      // Refetch complaints after submitting
      const refresh = await axios.post(
        "http://localhost:3000/student_complaint_details",
        { usn: studentData.usn }
      );

      setComplaint(
        refresh.data.map((c) => ({
          id: c.id,
          title: c.title,
          date: c.date,
          status: c.status,
        }))
      );
    } catch (error) {
      console.error("Error submitting complaint:", error);
      alert("Error submitting complaint: " + error.message);
    }
  }

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

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="default">New Complaint</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="text-center font-bold text-xl">
                  Complaint Registration
                </SheetTitle>
                <SheetDescription>
                  Add the complaints here properly
                </SheetDescription>
              </SheetHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                <div className="grid gap-6 px-4">
                  <div className="grid gap-3">
                    <Label>Complaint Title</Label>
                    <Input
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label>Complaint Category</Label>
                    <Select
                      value={category}
                      onValueChange={(value) => setCategory(value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electrical">Electrical</SelectItem>
                        <SelectItem value="plumbing">Plumbing</SelectItem>
                        <SelectItem value="furniture">Furniture</SelectItem>
                        <SelectItem value="network">Network</SelectItem>
                        <SelectItem value="health">Health</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-3">
                    <Label>Description</Label>
                    <Textarea
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>

                <SheetFooter>
                  <Button type="submit">Submit</Button>
                  <SheetClose asChild>
                    <Button variant="outline">Close</Button>
                  </SheetClose>
                </SheetFooter>
              </form>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {complaint.length === 0 ? (
              <div className="p-6 text-muted-foreground">No complaints yet.</div>
            ) : (
              complaint.map((c) => (
                <div
                  key={c.id}
                  className="p-6 flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{c.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Submitted on {c.date}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge
                      variant={c.status === "Pending" ? "default" : "outline"}
                    >
                      Pending
                    </Badge>
                    <Badge
                      variant={
                        c.status === "In Progress" ? "default" : "outline"
                      }
                    >
                      In Progress
                    </Badge>
                    <Badge
                      variant={
                        c.status === "Completed" ? "destructive" : "outline"
                      }
                    >
                      <BadgeCheckIcon className="w-4 h-4 mr-1" />
                      Completed
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default StdComplaints;
