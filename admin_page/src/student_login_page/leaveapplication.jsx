import React from "react";
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

function Leaveapplication() {
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
          <TabsTrigger value="checkout" className="h-10">
            Apply Check-out
          </TabsTrigger>
          <TabsTrigger value="checkin" className="h-10">
            Apply Check-in
          </TabsTrigger>
        </TabsList>

        <TabsContent value="checkout" className="mt-6  md:w-1/2 m-auto">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="font-bold text-xl" >Quick Check-out</CardTitle>
              <CardDescription>Apply for temporary leave from hostel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="checkout-from">From Date</Label>
                  <Input id="checkout-from" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkout-to">To Date</Label>
                  <Input id="checkout-to" type="date" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkout-reason">Reason</Label>
                <Textarea id="checkout-reason" rows={3} placeholder="Enter reason for leave..." />
              </div>
              <Button className="w-full">Submit Check-out Application</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="checkin" className="mt-6 md:w-1/2 m-auto">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="font-bold text-xl">Quick Check-in</CardTitle>
              <CardDescription>Apply to return to hostel after leave</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="checkin-date">Expected Check-in Date</Label>
                <Input id="checkin-date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkin-time">Expected Check-in Time</Label>
                <Input id="checkin-time" type="time" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkin-reason">Additional Notes</Label>
                <Textarea id="checkin-reason" rows={3} placeholder="Any additional information..." />
              </div>
              <Button className="w-full">Submit Check-in Application</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    
    </>
  );
}

export default Leaveapplication;
