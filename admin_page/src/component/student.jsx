import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";



export default function Student() {
  const [studentRecord, setStudentRecord] = useState([]);

  useEffect(() => {
    async function fetchStudentRecord() {
      try {
        const res = await fetch("http://localhost:3000/student_details");
        const data = await res.json();
        setStudentRecord(data.student_record);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }

    fetchStudentRecord();
  }, []);

  return (
    <div className="w-full max-w-full">
      <Tabs defaultValue="account" className="w-full">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="w-full">
          <div className="grid grid-cols-4 md:grid-cols-7 mb-4 border p-4 font-medium w-full text-sm md:text-lg items-center justify-center rounded-lg">
            <span>Room NO</span>
            <div>Student Name</div>
            <div className="hidden md:block">USN</div>
            <div className="hidden md:block">Phone NO</div>
            <div className="hidden md:block">Email</div>
            <div>Edit</div>
            <div>Delete</div>
          </div>
          {studentRecord.map((std, index) => (
            <div
              key={index}
              className="grid grid-cols-4 mb-1 md:grid-cols-7  border  p-4 text-sm w-full items-center rounded-lg"
            >
              <span className="truncate overflow-hidden">{std.room_no}</span>
              <span className=" truncate overflow-hidden">
                {std.student_name}
              </span>
              <span className=" hidden md:block truncate overflow-hidden">
                {std.usn}
              </span>
              <span className=" hidden md:block truncate overflow-hidden">
                {std.student_mobile_no}
              </span>
              <span className=" hidden md:block truncate overflow-hidden">
                {std.student_email}
              </span>
              <span>
                <Dialog>
                  <DialogTrigger>
                    <Button className="cursor-pointer" variant="outline">
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-xl">
                        View Profile Details
                      </DialogTitle>
                      <DialogDescription>
                        <div className="text-base font-semibold">
                          <span>Student USN: </span>
                          <span>{std.usn}</span>
                        </div>
                        <div className="text-base font-semibold">
                          <span>Student Name: </span>
                          <span>{std.student_name}</span>
                        </div>
                        <div className="text-base font-semibold">
                          <span>Alloted Room NO: </span>
                          <span>{std.room_no}</span>
                        </div>
                        <div className="text-base font-semibold">
                          <span>Student Phone NO: </span>
                          <span>{std.student_mobile_no}</span>
                        </div>
                        <div className="text-base font-semibold">
                          <span>Student Email Address: </span>
                          <span>{std.student_email}</span>
                        </div>
                        <div className="text-base font-semibold">
                          <span>Father's Name: </span>
                          <span>{std.student_father_name}</span>
                        </div>
                        <div className="text-base font-semibold">
                          <span>Mother's Name: </span>
                          <span>{std.student_mother_name}</span>
                        </div>
                        <div className="text-base font-semibold">
                          <span>Permanent Address: </span>
                          <span>{std.permanent_address}</span>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </span>
              <span>
                <Button className="cursor-pointer" variant="destructive">
                  Delete
                </Button>
              </span>
            </div>
          ))}
        </TabsContent>
        <TabsContent value="password" className="w-full">
          <div className="grid  md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:scale-102 hover:bg-gray-100 hover:shadow-2xl cursor-pointer">
            <CardHeader>
              <CardTitle>
                <div className="flex justify-center"><p className="text-2xl font-bold">100</p></div>
              </CardTitle>
              <CardDescription className=" flex justify-center"><span>Room Type: Single Room</span></CardDescription>
            </CardHeader>
            <CardContent>
            <div className="flex justify-between text-base text-muted-foreground">
              <div>K K Sagar</div>
              <div>2SD22CS039</div>
            </div>
            <div className="flex justify-between text-base text-muted-foreground">
              <div>K K Sagar</div>
              <div>2SD22CS039</div>
            </div>
            <div className="flex justify-between text-base text-muted-foreground">
              <div>K K Sagar</div>
              <div>2SD22CS039</div>
            </div>
              <p className="text-xs text-muted-foreground flex gap-4 mt-5">
                    ** discription about the room members **
              </p>
            </CardContent>
          </Card>
         <Card >
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription><span>Card Description</span></CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground flex gap-4">
                    <div>
                      K K Sagar
                    </div>
                    <div>
                      2SD22CS039
                    </div>
              </p>
            </CardContent>
          </Card>
          <Card >
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription><span>Card Description</span></CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground flex gap-4">
                    <div>
                      K K Sagar
                    </div>
                    <div>
                      2SD22CS039
                    </div>
              </p>
            </CardContent>
          </Card>
          <Card >
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription><span>Card Description</span></CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground flex gap-4">
                    <div>
                      K K Sagar
                    </div>
                    <div>
                      2SD22CS039
                    </div>
              </p>
            </CardContent>
          </Card>
          <Card >
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription><span>Card Description</span></CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground flex gap-4">
                    <div>
                      K K Sagar
                    </div>
                    <div>
                      2SD22CS039
                    </div>
              </p>
            </CardContent>
          </Card>
          <Card >
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription><span>Card Description</span></CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground flex gap-4">
                    <div>
                      K K Sagar
                    </div>
                    <div>
                      2SD22CS039
                    </div>
              </p>
            </CardContent>
          </Card>
          <Card >
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription><span>Card Description</span></CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground flex gap-4">
                    <div>
                      K K Sagar
                    </div>
                    <div>
                      2SD22CS039
                    </div>
                    
              </p>
            </CardContent>
          </Card>
          <Card >
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription><span>Card Description</span></CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground flex gap-4">
                    <div>
                      K K Sagar
                    </div>
                    <div>
                      2SD22CS039
                    </div>
              </p>
            </CardContent>
          </Card>
          <Card >
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription><span>Card Description</span></CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground flex gap-4">
                    <div>
                      K K Sagar
                    </div>
                    <div>
                      2SD22CS039
                    </div>
              </p>
            </CardContent>
          </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
