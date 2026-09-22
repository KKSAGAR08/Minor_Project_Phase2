import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card1";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import { DataAPI } from "../lib/axiosInstance";

function NewRegister() {
  const [usn, setUsn] = useState("");
  const [stdname, setStdName] = useState("");
  const [stdemail, setStdEmail] = useState("");
  const [stdmobileno, setStdMobileno] = useState("");
  const [stdfathername, setFathername] = useState("");
  const [stdmothername, setMothername] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDOB] = useState("");
  const [address, setAddress] = useState("");
  const [roomType, setRoomType] = useState("");
  const [roomNo, setRoomNo] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    

    const payload = {
      usn,
      std_name: stdname,
      std_email: stdemail,
      mobile_no: stdmobileno,
      std_fname: stdfathername,
      std_mname: stdmothername,
      gender,
      dob,
      address,
      roomno: roomNo,
    };

    try {
      const response = await DataAPI.post("admin/newregister/", payload);

      toast("Student Registration", {
        description: response.data.message,
      });

      setUsn("");
      setStdName("");
      setStdEmail("");
      setStdMobileno("");
      setFathername("");
      setMothername("");
      setGender("");
      setDOB("");
      setAddress("");
      setRoomType("");
      setRoomNo("");
    } catch (error) {
      const data = error.response?.data;

      if (data) {
        Object.values(data).forEach((messages) => {
          messages.forEach((message) => {
            toast.error(message);
          });
        });
      }
      else{
        toast.error(error)
      }
    } 
  };

  return (
    <>
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl text-center md:text-left font-semibold">
            New Student Registration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Toaster position="top-center" />
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="usn" className="text-sm font-medium">
                  USN (University Serial Number)
                </label>
                <input
                  id="usn"
                  type="text"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Enter USN"
                  required
                  value={usn}
                  onChange={(e) => setUsn(e.target.value)}
                  maxLength={10}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="student_name" className="text-sm font-medium">
                  Student Name
                </label>
                <input
                  id="student_name"
                  type="text"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Enter full name"
                  required
                  value={stdname}
                  onChange={(e) => setStdName(e.target.value)}
                  maxLength={30}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Enter email address"
                  required
                  value={stdemail}
                  onChange={(e) => setStdEmail(e.target.value)}
                  maxLength={50}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="mobile_no" className="text-sm font-medium">
                  Mobile Number
                </label>
                <input
                  id="mobile_no"
                  type="tel"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Enter mobile number"
                  required
                  value={stdmobileno}
                  onChange={(e) => setStdMobileno(e.target.value)}
                  maxLength={10}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="father_name" className="text-sm font-medium">
                  Father's Name
                </label>
                <input
                  id="father_name"
                  type="text"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Enter father's name"
                  required
                  value={stdfathername}
                  onChange={(e) => setFathername(e.target.value)}
                  maxLength={30}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="mother_name" className="text-sm font-medium">
                  Mother's Name
                </label>
                <input
                  id="mother_name"
                  type="text"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Enter mother's name"
                  required
                  value={stdmothername}
                  onChange={(e) => setMothername(e.target.value)}
                  maxLength={30}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="gender" className="text-sm font-medium">
                  Gender
                </label>
                <select
                  id="gender"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={gender}
                  required
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select room type</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="dob" className="text-sm font-medium">
                  DOB
                </label>
                <input
                  id="dob"
                  type="date"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Enter mother's name"
                  required
                  value={dob}
                  onChange={(e) => setDOB(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium">
                Address
              </label>
              <textarea
                id="address"
                rows={2}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Enter full address"
                value={address}
                required
                onChange={(e) => setAddress(e.target.value)}
                maxLength={70}
              ></textarea>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="room_preference"
                  className="text-sm font-medium"
                >
                  Room Preference
                </label>
                <select
                  id="room_preference"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={roomType}
                  required
                  onChange={(e) => setRoomType(e.target.value)}
                >
                  <option value="">Select room type</option>
                  <option value="Single">Single Room</option>
                  <option value="Double">Double Room</option>
                  <option value="Triple">Triple Room</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="Room_No" className="text-sm font-medium">
                  Room No
                </label>
                <input
                  id="Roomno"
                  type="number"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={roomNo}
                  required
                  onChange={(e) => setRoomNo(e.target.value)}
                  maxLength={5}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                required
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                I agree to the hostel terms and conditions
              </label>
            </div>

            <div className="flex justify-center md:justify-end ">
              <Button type="submit" className="cursor-pointer">
                Submit Registration
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}

export default NewRegister;
