import React, { useEffect, useState } from "react";
import {
  Card,
  CardAction,
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
import axios from "axios";
import { MoveDown, MoveUp } from "lucide-react";

function StudentFeeDetails() {
  const [paymentDetails, setPaymentDetails] = useState({});
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function fetchPaymentDetails() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/payment`
        );
        setPaymentDetails(response.data.paymentDetails);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchPaymentDetails();
  }, []);

  console.log(paymentDetails);
  return (
    <>
      <div className="grid grid-cols-3 mb-4 border p-4 font-medium w-full text-sm md:text-lg items-center justify-center rounded-lg">
        <span>USN</span>
        <div>Student Name</div>
        <div>View More</div>
      </div>

      {Object.entries(paymentDetails).map(([usn, students]) => (
        <Accordion key={usn} type="single" collapsible>
          <AccordionItem value="item-1">
            <Card className="mb-2 rounded-lg border">
              <CardHeader className="grid grid-cols-3 items-center text-sm font-normal">
                <span>{usn}</span>

                <span>{students.student_name}</span>
                <AccordionTrigger asChild>
                  <Button className="bg-blue-500 hover:bg-blue-600 cursor-pointer flex justify-center items-center space-x-2">
                    <span>View</span>
                    <MoveDown className="transition-transform duration-300 data-[state=open]:rotate-180" />
                  </Button>
                </AccordionTrigger>
              </CardHeader>

              <AccordionContent>
                <CardContent>
                  {Object.entries(students).map(([year, records]) => {
                    if (year === "student_name") return null;
                    return (
                      <div key={year} className="mb-8">
                        <h3 className="text-lg font-semibold mb-2">
                          Year: {year}
                        </h3>
                        <Table>
                          <TableCaption>Invoices for {year}</TableCaption>
                          <TableHeader>
                            <TableRow>
                              <TableHead>CHECKINDATE</TableHead>
                              <TableHead>CHECKOUTDATE</TableHead>
                              <TableHead>DAYS</TableHead>
                              <TableHead>STATUS</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {records.map((detail, i) => (
                              <TableRow key={`${year}-${i}`}>
                                <TableCell>{detail.startDate}</TableCell>
                                <TableCell>{detail.endDate}</TableCell>
                                <TableCell>{detail.days}</TableCell>
                                <TableCell>
                                  {detail.status ? "Paid" : "Pending"}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    );
                  })}
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
        </Accordion>
      ))}
    </>
  );
}

export default StudentFeeDetails;
