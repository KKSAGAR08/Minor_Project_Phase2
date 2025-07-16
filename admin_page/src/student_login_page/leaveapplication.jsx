import React, { useState,useEffect } from "react";
import {
  Bell,
  CreditCard,
  FileText,
  Home,
  LogOut,
  MessageSquare,
  Settings,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";

function Leaveapplication() {
  const [checkOutDate, setcheckOutDate] = useState("");
  const [expCheckinDate, setExpCheckinDate] = useState("");
  const [reason, setReason] = useState("");
  const [checkInDate, setcheckInDate] = useState("");
  const [time, setTime] = useState("");
  const [addReason, setAddReason] = useState("");
  const [studentData, setStudentData] = useState("");


  useEffect(() => {
    async function fetchStudentDetails() {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "https://minor-project-phase2.onrender.com/student_dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStudentData(response.data.studentDetails);
        
      } catch (error) {
        console.error("Error fetching student:", error);
      }
    }
    fetchStudentDetails();
    
  }, []);


  async function handleCheckoutData() {
    try{
    const checkoutDetails = {
      usn:studentData.usn,
      roomno:studentData.room_no,
      checkOutDate,expCheckinDate,reason
    }

    const response = await axios.post('https://minor-project-phase2.onrender.com/student_checkout',checkoutDetails);

    alert('Your checkout is stored successfully ',response.data.message);

    setExpCheckinDate('');
    setReason('');
    setcheckOutDate('');

  }catch(error){
    console.error("Error submitting details:", error);
    alert("Error submitting complaint: " + error.message);
  }



  }
  async function handleCheckinData() {

    try{

    const checkinDetails = {
      usn:studentData.usn,
      roomno:studentData.room_no,
      checkInDate,time,addReason
    }

    const response = await axios.post('https://minor-project-phase2.onrender.com/student_checkin',checkinDetails);

    setAddReason('');
    setTime('');
    setcheckInDate('');

    alert('Your checkin is stored successfully ',response.data.message);
  }catch (error) {
  console.error("Error submitting details:", error);

  if (error.response && error.response.data && error.response.data.message) {
    // 👇 Show your backend's error message
    alert("Error: " + error.response.data.message);
  } else if (error.request) {
    // Server didn’t respond at all
    alert("Error: No response from server.");
  } else {
    // Something else (like a JS error before axios ran)
    alert("Error: " + error.message);
  }
}


  }

  return (
    <>
      <div className="flex justify-between items-center w-full">
        <div>
          <h2 className="text-2xl font-bold">Leave Applications</h2>
          <p className="text-muted-foreground">
            Apply for check-in/check-out and track your avability
          </p>
        </div>
      </div>
      <Tabs defaultValue="checkout" className="w-full">
        <TabsList className="grid  md:w-1/2  m-auto mt-5 grid-cols-2 h-12">
          <TabsTrigger value="checkout" className="h-10 cursor-pointer">
            Apply Check-out
          </TabsTrigger>
          <TabsTrigger value="checkin" className="h-10 cursor-pointer">
            Apply Check-in
          </TabsTrigger>
        </TabsList>

        <TabsContent value="checkout" className="mt-6  md:w-1/2 m-auto">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="font-bold text-xl">
                Quick Check-out
              </CardTitle>
              <CardDescription>
                Apply for temporary leave from hostel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCheckoutData();
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="checkout-from">Check-out Date</Label>
                    <Input
                      value={checkOutDate}
                      onChange={(e) => setcheckOutDate(e.target.value)}
                      id="checkout-from"
                      type="date"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="checkout-to">Expected Check-in Date</Label>
                    <Input
                      value={expCheckinDate}
                      onChange={(e) => setExpCheckinDate(e.target.value)}
                      id="checkout-to"
                      type="date"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkout-reason">Reason</Label>
                  <Textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    id="checkout-reason"
                    rows={3}
                    placeholder="Enter reason for leave..."
                    required
                  />
                </div>
                <Button className="w-full cursor-pointer" type="submit">
                  Submit Check-out Application
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="checkin" className="mt-6 md:w-1/2 m-auto">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="font-bold text-xl">
                Quick Check-in
              </CardTitle>
              <CardDescription>
                Apply to return to hostel after leave
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCheckinData();
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="checkin-from">Check-in Date</Label>
                    <Input
                      value={checkInDate}
                      onChange={(e) => setcheckInDate(e.target.value)}
                      id="checkin-from"
                      type="date"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="checkin-time">Check-in time</Label>
                    <Input
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      id="checkin-time"
                      type="time"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="additional-reason">Additional Notes</Label>
                  <Textarea
                    value={addReason}
                    onChange={(e) => setAddReason(e.target.value)}
                    id="additional-reason"
                    rows={3}
                    placeholder="Any additional information..."
                  />
                </div>
                <Button className="w-full cursor-pointer" type="submit">
                  Submit Check-in Application
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}

export default Leaveapplication;
