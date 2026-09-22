import React, { useState, useEffect } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataAPI } from "../lib/axiosInstance";
import { UseLoader } from "../lib/loader";

function RoomWiseDetails() {
  const [studentRecord, setStudentRecord] = useState([]);
  const [roomdetails, setRoomDetails] = useState();
  const { showLoader, hideLoader } = UseLoader();

  useEffect(() => {
    async function fetchStudentRecord() {
      try {
        showLoader()
        const res = await DataAPI.get("admin/studentsdetails/");
        setStudentRecord(res.data.student_record);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
      finally{
        hideLoader()
      }
    }

    fetchStudentRecord();
  }, []);


  useEffect(() => {
    const arrangeRoomDetails = () => {
      const val = studentRecord.reduce((acc, cur) => {
        if (!acc[cur.roomno]) {
          acc[cur.roomno] = [];
        }
        acc[cur.roomno].push({ name: cur.std_name, usn: cur.usn });
        return acc;
      },{});

      setRoomDetails(val);
    };

    arrangeRoomDetails();
  }, [studentRecord]);

  console.log(studentRecord)

  

  return (
    <>
      <div className="grid  md:grid-cols-2 lg:grid-cols-4 gap-4">
        {roomdetails && Object.entries(roomdetails).map(([room, students], key) => (
          <Card
            key={key}
            className="hover:scale-102 hover:bg-gray-100 hover:shadow-2xl cursor-pointer"
          >
            <CardHeader>
              <CardTitle>
                <div className="flex justify-center">
                  <p className="text-2xl font-bold">{room}</p>
                </div>
              </CardTitle>
              {/* <CardDescription className=" flex justify-center">
                <span>Room Type:{students[0]}</span>
              </CardDescription> */}
            </CardHeader>
            <CardContent>
              {students.map((val, index) => (
                <div
                  key={index}
                  className="flex justify-between text-sm text-muted-foreground"
                >
                  <div>{val.name}</div>
                  <div>{val.usn}</div>
                </div>
              ))}
              <p className="text-xs text-muted-foreground flex gap-4 mt-5 justify-center">
                **Students In This Room**
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

export default RoomWiseDetails;
