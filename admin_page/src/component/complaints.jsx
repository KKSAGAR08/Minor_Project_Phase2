import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import { Trash2 } from "lucide-react";
import { DataAPI } from "../lib/axiosInstance";
import toast, { Toaster } from "react-hot-toast";
import { UseLoader } from "../lib/loader";

function ComplaintsContent() {
  const [complaints, setComplaints] = useState([]);
  const { showLoader, hideLoader } = UseLoader();

  useEffect(() => {
    async function fetchComplaint() {
      try {
        showLoader()
        const response = await DataAPI.get("admin/complaints/");

        const complaintsData = response.data.complaints;

        setComplaints(
          complaintsData.map((c) => ({
            id: c.id,
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
      } catch (error) {
        const data = error.response?.data;

        if (data) {
          Object.values(data).forEach((messages) => {
            messages.forEach((message) => {
              toast.error(message);
            });
          });
        } else {
          toast.error(error);
        }
      }
      finally{
        hideLoader()
      }
    }

    fetchComplaint();
  }, []);

  async function handleUpdate(id) {
    const complaintUpdate = complaints.find((c) => c.id === id);
    if (!complaintUpdate) return;

    const payload = {
      status: complaintUpdate.status,
    };

    try {
      showLoader()
      await DataAPI.patch(`admin/complaints/${id}/`, payload);
      toast.success("Status updated successfully!");
    } catch (error) {
      const data = error.response?.data;

      if (data) {
        Object.values(data).forEach((messages) => {
          messages.forEach((message) => {
            toast.error(message);
          });
        });
      } else {
        toast.error(error);
      }
    }
    finally{
      hideLoader()
    }
  }

  async function deleteComplaint(id) {
    const deleteComplaints = complaints.find((e) => e.id === id);

    if (!deleteComplaints) {
      return;
    }
    try {
      showLoader()
      await DataAPI.delete(`admin/complaints/${id}/`);

      setComplaints((prev) => prev.filter((c) => c.id !== id));
      toast.success("Status deleted successfully!");
    } catch (error) {
      const data = error.response?.data;

      if (data) {
        Object.values(data).forEach((messages) => {
          messages.forEach((message) => {
            toast.error(message);
          });
        });
      } else {
        toast.error(error);
      }
    }finally{
      hideLoader()
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Complaints Management</CardTitle>
          <CardDescription>
            Manage and track all maintenance complaints
          </CardDescription>
        </CardHeader>
        <CardContent key={1}>
          {complaints.length === 0 ? (
            <div className="p-6 text-muted-foreground">No complaints yet.</div>
          ) : (
            complaints.map((complaint, index) => (
              <Accordion type="single" collapsible>
                <Card className="py-0 rounded-lg mb-3">
                  <CardContent key={index} className="px-0">
                    <AccordionItem value="item-1">
                      <div>
                        <div className="flex items-center p-4">
                          <div className="flex items-center gap-4 justify-between w-full">
                            <div className="flex items-center gap-4">
                              <div>{index + 1}</div>
                              <div>
                                <AccordionTrigger className="text-lg cursor-pointer">
                                  {complaint.title}
                                </AccordionTrigger>
                                <p className="text text-muted-foreground text-base">
                                  Room {complaint.room} • {complaint.student} •{" "}
                                  {complaint.date}
                                </p>
                              </div>
                            </div>
                            <div className="items-center flex gap-5">
                              <ToggleGroup
                                type="single"
                                value={complaint.status}
                                onValueChange={(val) => {
                                  if (val) {
                                    setComplaints((prev) =>
                                      prev.map((c) =>
                                        c.id === complaint.id
                                          ? { ...c, status: val }
                                          : c,
                                      ),
                                    );
                                  }
                                }}
                              >
                                <ToggleGroupItem
                                  value="Pending"
                                  aria-label="Pending"
                                  className="data-[state=on]:bg-yellow-100 data-[state=on]:text-yellow-800"
                                >
                                  Pending
                                </ToggleGroupItem>
                                <ToggleGroupItem
                                  value="In Progress"
                                  aria-label="In Progress"
                                  className="data-[state=on]:bg-blue-100 data-[state=on]:text-blue-800"
                                >
                                  In Progress
                                </ToggleGroupItem>
                                <ToggleGroupItem
                                  value="Completed"
                                  aria-label="Completed"
                                  className="data-[state=on]:bg-green-100 data-[state=on]:text-green-800"
                                >
                                  Completed
                                </ToggleGroupItem>
                              </ToggleGroup>
                              <Button
                                variant="outline"
                                className="cursor-pointer"
                                onClick={() => handleUpdate(complaint.id)}
                              >
                                Update
                              </Button>
                              <Button
                                variant="destructive"
                                className="cursor-pointer"
                                onClick={() => deleteComplaint(complaint.id)}
                              >
                                <Trash2 />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <AccordionContent className="bg-muted">
                        <Separator className="w-full" />
                        <div className="px-10 py-4 space-y-2">
                          <p className="font-medium text-lg">
                            Complaint Details
                          </p>
                          <div className="flex flex-col gap-3">
                            <span className="text-base ">
                              <span className="font-medium">Category: </span>
                              <span className="text-muted-foreground">
                                {complaint.category}
                              </span>
                            </span>
                            <span className="text-base ">
                              <span className="font-medium">Discription: </span>
                              <span className="text-muted-foreground">
                                {complaint.description}
                              </span>
                            </span>
                            <span className="text-base ">
                              <span className="font-medium">Status: </span>
                              <span className="text-muted-foreground">
                                {complaint.status}
                              </span>
                            </span>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </CardContent>
                </Card>
              </Accordion>
            ))
          )}
        </CardContent>
      </Card>
    </>
  );
}

export default ComplaintsContent;
