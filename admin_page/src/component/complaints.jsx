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
import axios from "axios";
import { Trash2 } from 'lucide-react';

function ComplaintsContent() {
  const [complaints, setComplaints] = useState([]);

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
      
      } catch (error) {
        alert("Error in Fetching data: " + error.response.data.message);
      }
    }

    fetchComplaint();
  }, []);

  async function handleUpdate(id) {
    const complaintUpdate = complaints.find((c) => c.id === id);
    if (!complaintUpdate) return;

    const payload = {
      complaint_id: id,
      complaint_status: complaintUpdate.status,
    };

    try {
      const response = await axios.put(
        "http://localhost:3000/update_complaint_status",
        payload
      );

      console.log(response.data.message)

      alert("Status updated successfully!"+ response.data.message);
    } catch (error) {
      alert("Error updating complaint: " + error.message);
    }
  }

  async function deleteComplaint(id) {

    const deleteComplaints = complaints.find((e)=>e.id===id);

    if(!deleteComplaints){ return;}
    


    const payload = {
      complaint_id: id,
    };

    try{
    const response = await axios.delete(
        "http://localhost:3000/delete_complaint",
        { data: payload }
      );

      setComplaints((prev) => prev.filter((c) => c.id !== id));
      alert("Status deleted successfully!"+ response.data.message);

    }
    catch (error) {
      alert("Error Deleting complaint: " + error.message);
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
        <CardContent>
          {complaints.map((complaints, index) => (
            <Accordion type="single" collapsible>
              <Card className="py-0 rounded-lg mb-3">
                <CardContent className="px-0">
                  <AccordionItem value="item-1">
                    <div>
                      <div className="flex items-center p-4">
                        <div className="flex items-center gap-4 justify-between w-full">
                          <div className="flex items-center gap-4">
                            <div>{index + 1}</div>
                            <div>
                              <AccordionTrigger className="text-lg cursor-pointer">
                                {complaints.title}
                              </AccordionTrigger>
                              <p className="text text-muted-foreground text-base">
                                Room {complaints.room} • {complaints.student} •{" "}
                                {complaints.date}
                              </p>
                            </div>
                          </div>
                          <div className="items-center flex gap-5">
                            <ToggleGroup
                              type="single"
                              value={complaints.status}
                              onValueChange={(val) => {
                                if (val) {
                                  setComplaints((prev) =>
                                    prev.map((c) =>
                                      c.id === complaints.id
                                        ? { ...c, status: val }
                                        : c
                                    )
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
                              onClick={() => handleUpdate(complaints.id)}
                            >
                              Update
                            </Button>
                            <Button variant="destructive" className="cursor-pointer" onClick={()=>deleteComplaint(complaints.id)}><Trash2 /></Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <AccordionContent className="bg-muted">
                      <Separator className="w-full" />
                      <div className="px-10 py-4 space-y-2">
                        <p className="font-medium text-lg">Complaint Details</p>
                        <div className="flex flex-col gap-3">
                          <span className="text-base ">
                            <span className="font-medium">Category: </span>
                            <span className="text-muted-foreground">
                              {complaints.category}
                            </span>
                          </span>
                          <span className="text-base ">
                            <span className="font-medium">Discription: </span>
                            <span className="text-muted-foreground">
                              {complaints.description}
                            </span>
                          </span>
                          <span className="text-base ">
                            <span className="font-medium">Status: </span>
                            <span className="text-muted-foreground">
                              {complaints.status}
                            </span>
                          </span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </CardContent>
              </Card>
            </Accordion>
          ))}
        </CardContent>
      </Card>
    </>
  );
}

export default ComplaintsContent;
