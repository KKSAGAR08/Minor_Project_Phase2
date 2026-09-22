import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import RoomWiseDetails from "./room_wise_details";
import StudentWiseDetails from "./student_wise_details";
import StudentFeeDetails from "./student_fee_details";

export default function Student() {
  return (
    <div className="w-full max-w-full">
      <Tabs defaultValue="student" className="w-full">
        <TabsList>
          <TabsTrigger value="student" className="cursor-pointer">Students Details</TabsTrigger>
          <TabsTrigger value="room" className="cursor-pointer">Room Details</TabsTrigger>
          <TabsTrigger value="payment" className="cursor-pointer">Student Payment Details</TabsTrigger>
        </TabsList>
        <TabsContent value="student" className="w-full">
          <StudentWiseDetails />
        </TabsContent>
        <TabsContent value="room" className="w-full">
          <RoomWiseDetails/>
        </TabsContent>
        <TabsContent value="payment" className="w-full">
          <StudentFeeDetails/>
        </TabsContent>
      </Tabs>
    </div>
  );
}
