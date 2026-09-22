import React, { useEffect, useState } from "react";
import {
  Home,
  Inbox,
  Search,
  Settings,
  Hotel,
  Wrench,
  MessageSquare,
  BadgeCheckIcon,
  LoaderCircle,
} from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51RxXgKDck0OszFiR5k0hrjmv8PXbXIQtgVnrP8Ppi111Srozju3zwQIjjhxUuvdGDPE0PUvIv28KNWTCsSk8O9ht00EKJlHPRC"
);

function Feepayment() {
  const [click, setClick] = useState(null);
  const [studentData, setStudentData] = useState("");
  useEffect(() => {
    async function fetchStudentDetails() {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/student/`,
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

  const [feeDetails, setfeeDetails] = useState([]);

  useEffect(() => {
    async function getFeeDetails() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/student/payment/${studentData.usn}`
        );
        setfeeDetails(response.data.data.yearlyTotal);
      } catch (error) {
        console.error("Error fetching fee details:", error);
      }
    }
    getFeeDetails();
  }, [studentData]);

  // console.log(feeDetails);

  async function handlePayment(year, amount) {
    const token = localStorage.getItem("token");
    try {
      const session = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/student/payment/${studentData.usn}/year/${year}/amount/${amount}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const stripe = await stripePromise;

      await stripe.redirectToCheckout({
        sessionId: session.data.session.id,
      });
    } catch (error) {
      console.log("Error fetching fee details:", error);
      alert("Error making session try afterwards");
    } finally {
      setClick(null);
    }
  }

  return (
    <>
      <div className="py-2 w-full">
        <div className="flex justify-between items-center w-full">
          <div>
            <h2 className="text-2xl font-bold">Payment </h2>
            <p className="text-muted-foreground">
              Pay the bill and View your payment history and pending dues
            </p>
          </div>
        </div>
      </div>
      {feeDetails.length>0?
      (<Card className="mt-3">
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {feeDetails.map((fee, index) => (
              <AccordionItem key={index} value={`year-${fee.year}`}>
                <div className="p-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <AccordionTrigger className="cursor-pointer">
                      <p className="font-semibold text-lg">{fee.year}</p>
                    </AccordionTrigger>
                  </div>

                  <div className="flex items-center space-x-4">
                    <p className="font-semibold">₹{fee.amount}</p>
                    <Badge
                      className="hidden md:flex"
                      variant={fee.paymentstatus ? "default" : "destructive"}
                    >
                      {fee.paymentstatus ? (
                        <>
                          <BadgeCheckIcon /> Paid
                        </>
                      ) : (
                        "Pending"
                      )}
                    </Badge>
                    <Button
                      id={`btn-${fee.year}`}
                      variant="outline"
                      disabled={fee.paymentstatus}
                      className="cursor-pointer"
                      onClick={() => {
                        setClick(fee.year);
                        handlePayment(fee.year, fee.amount);
                      }}
                    >
                      {click === fee.year ? (
                        <LoaderCircle className="animate-spin" />
                      ) : (
                        <span>Pay Now</span>
                      )}
                    </Button>
                  </div>
                </div>

                <AccordionContent className="px-1">
                  
                    <Table>
                      <TableCaption>
                        your attendence details in {fee.year} 😊 
                      </TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">SNO</TableHead>
                          <TableHead>checkindate</TableHead>
                          <TableHead>checkoutdate</TableHead>
                          <TableHead className="text-right">days</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {fee.data.map((data, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{data.serial_no}</TableCell>
                          <TableCell>{new Date(data.checkindate).toDateString()}</TableCell>
                          <TableCell>{new Date(data.checkoutdate).toDateString()}</TableCell>
                          <TableCell className="text-right">{data.days}</TableCell>
                        </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>):
      (<span className="flex justify-center my-5 text-4xl text-muted-foreground">NO DATA</span>)
}
    </>
  );
}

export default Feepayment;
