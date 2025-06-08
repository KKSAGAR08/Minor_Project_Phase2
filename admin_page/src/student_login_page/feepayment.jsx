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
import { Badge } from "@/components/ui/badge";

function Feepayment() {

 const Fee = [
    {
      month: "April",
      amount: 1200,
      fromDate: "01-04-2025",
      toDate: "01-05-2025",
      status: "Pending",
    },
    {
      month: "March",
      amount: 1200,
      fromDate: "01-03-2025",
      toDate: "01-04-2025",
      status: "Pending",
    },
    {
      month: "February",
      amount: 1500,
      fromDate: "01-02-2025",
      toDate: "01-03-2025",
      status: "Paid",
    },
    {
      month: "January",
      amount: 1300,
      fromDate: "01-01-2025",
      toDate: "01-02-2025",
      status: "Paid",
    },
  ];
  return (
    <>
      <div className="py-2 w-full">
        <div className="flex justify-between items-center w-full">
          <div>
            <h2 className="text-2xl font-bold">Payment History</h2>
            <p className="text-muted-foreground">
              View your payment history and pending dues
            </p>
          </div>
        </div>
      </div>
      <Card className="mt-3">
        <CardContent>
          <div className="divide-y">
            {Fee.map((fee) => (
              <div className="p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-semibold">{fee.month}</p>
                  <p className="text-sm text-muted-foreground">
                    {fee.fromDate} - {fee.toDate}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <p className="font-semibold">₹{fee.amount}</p>
                  <Badge className="hidden md:flex"
                    variant={fee.status === "Pending" ? "destructive" : "default"}
                  >
                    {fee.status === "Pending" ? "Pending" : <><BadgeCheckIcon/> Paid</>}
                  </Badge>
                  <Button variant="outline" disabled={fee.status === "Paid"} className="cursor-pointer">Pay Now</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default Feepayment;
