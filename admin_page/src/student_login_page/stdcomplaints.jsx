import React, { useState, useEffect } from "react";
import { BadgeCheckIcon, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DataAPI } from "../lib/axiosInstance";
import toast from "react-hot-toast";
import { UseLoader } from "../lib/loader";

function StdComplaints() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [complaint, setComplaint] = useState([]);
  const { showLoader, hideLoader } = UseLoader();

  useEffect(() => {
    async function fetchStudentDetails() {
      try {
        showLoader()
        const response = await DataAPI.get("studentdetails/");
        setStudentData(response.data.studentDetails);
      } catch (error) {
        toast.error(error.message);
      }
      finally{
        hideLoader()
      }
    }
    fetchStudentDetails();
  }, []);

  useEffect(() => {
    async function fetchComplaint() {
      if (!studentData?.usn) return;

      try {
        showLoader()
        const response = await DataAPI.get("complaint/");

        setComplaint(
          response.data.map((c) => ({
            id: c.id,
            title: c.title,
            date: c.created_at.split("T")[0],
            status: c.status,
          })),
        );
      } catch (error) {
        toast.error(error.message);
      }finally{
        hideLoader()
      }
    }

    fetchComplaint();
  }, [studentData]);

  async function handleSubmit() {
    try {
      showLoader()
      const newComplaint = {
        roomno: studentData.roomno,
        usn: studentData.usn,
        title,
        category,
        description,
        status: "Pending",
      };

      const response = await DataAPI.post("complaint/", newComplaint);

      toast.success("Complaint submitted successfully: ");

      setTitle("");
      setCategory("");
      setDescription("");

      setComplaint((prev) => [
        ...prev,
        {
          id: response.data.id,
          title: response.data.title,
          date: response.data.created_at.split("T")[0],
          status: response.data.status,
        },
      ]);
    } catch (error) {
      toast.error(error.message);
    }
    finally{
      hideLoader()
    }
  }

  async function handleDelete(id) {
    try {
      showLoader()
      await DataAPI.delete(`/complaints/${id}/`);
      const data = complaint.filter((c) => c.id !== id);

      setComplaint(data);

      toast.success(`Complaint with id:${id} deleted`);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
    finally{
      hideLoader()
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
              <Button variant="default" className="cursor-pointer">
                New Complaint
              </Button>
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
                  <Button type="submit" className="cursor-pointer">
                    Submit
                  </Button>
                  <SheetClose asChild>
                    <Button variant="outline" className="cursor-pointer">
                      Close
                    </Button>
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
              <div className="p-6 text-muted-foreground">
                No complaints yet.
              </div>
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
                    <div className="sm:hidden">
                      {c.status === "Pending" && (
                        <Badge variant="default">Pending</Badge>
                      )}
                      {c.status === "In Progress" && (
                        <Badge variant="default">In Progress</Badge>
                      )}
                      {c.status === "Completed" && (
                        <Badge variant="destructive">
                          <BadgeCheckIcon className="w-4 h-4 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>

                    <div className="hidden sm:flex items-center space-x-4">
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
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          className="cursor-pointer"
                        >
                          <Trash2 />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your account and remove your data from our
                            servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(c.id)}>
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
