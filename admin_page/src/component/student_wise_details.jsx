import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import axios from "axios";
import { DataAPI } from "../lib/axiosInstance";
import { Button } from "@/components/ui/button";
import { UseLoader } from "../lib/loader";

function StudentWiseDetails() {
  const [studentRecord, setStudentRecord] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { showLoader, hideLoader } = UseLoader();
  const limit = 10;

  function getPagination(currentPage, totalPages) {
    let pages = [];
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 2) {
      pages.push(1, 2, 3, "...");
      pages.push(totalPages);
    } else if (currentPage > 3 && currentPage < totalPages - 2) {
      pages.push("...");
      pages.push(currentPage - 1, currentPage, currentPage + 1);
      pages.push("...");
    } else {
      pages.push("...");
      pages.push(totalPages - 2, totalPages - 1, totalPages);
    }

    return pages;
  }

  async function fetchStudentRecord() {
    try {
      showLoader();
      const res = await DataAPI.get(
        `admin/studentsdetails/?page=${currentPage}&limit=${limit}`,
      );

      setStudentRecord(res.data.student_record);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      hideLoader();
    }
  }

  useEffect(() => {
    fetchStudentRecord();
  }, [currentPage]);

  const handleDelete = async (usn) => {
    const token = localStorage.getItem("token");

    try {
      showLoader();
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/students/${usn}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert(response.data.message);

      setStudentRecord((prev) => prev.filter((std) => std.usn !== usn));
    } catch (error) {
      alert(
        "Error deleting student: " +
          (error.response?.data?.message || error.message),
      );
    } finally {
      hideLoader();
    }
  };

  return (
    <>
      <div className="grid grid-cols-4 md:grid-cols-7 mb-4 border p-4 font-medium w-full text-sm md:text-lg items-center justify-center rounded-lg">
        <span>Room NO</span>
        <div>Student Name</div>
        <div className="hidden md:block">USN</div>
        <div className="hidden md:block">Phone NO</div>
        <div className="hidden md:block">Email</div>
        <div>View</div>
        <div>Delete</div>
      </div>

      {studentRecord.map((std, index) => (
        <div
          key={index}
          className="grid grid-cols-4 mb-1 md:grid-cols-7 border p-4 text-sm w-full items-center rounded-lg"
        >
          <span className="truncate overflow-hidden">{std.roomno}</span>
          <span className="truncate overflow-hidden">{std.std_name}</span>
          <span className="hidden md:block truncate overflow-hidden">
            {std.usn}
          </span>
          <span className="hidden md:block truncate overflow-hidden">
            {std.mobile_no}
          </span>
          <span className="hidden md:block truncate overflow-hidden">
            {std.std_email}
          </span>

          <span>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="cursor-pointer" variant="outline">
                  View
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
                      <span>{std.std_name}</span>
                    </div>
                    <div className="text-base font-semibold">
                      <span>Alloted Room NO: </span>
                      <span>{std.roomno}</span>
                    </div>
                    <div className="text-base font-semibold">
                      <span>Student Phone NO: </span>
                      <span>{std.mobile_no}</span>
                    </div>
                    <div className="text-base font-semibold">
                      <span>Student Email Address: </span>
                      <span>{std.std_email}</span>
                    </div>
                    <div className="text-base font-semibold">
                      <span>Father's Name: </span>
                      <span>{std.std_fname}</span>
                    </div>
                    <div className="text-base font-semibold">
                      <span>Mother's Name: </span>
                      <span>{std.std_mname}</span>
                    </div>
                    <div className="text-base font-semibold">
                      <span>Permanent Address: </span>
                      <span>{std.address}</span>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </span>

          <span>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="cursor-pointer"
                  disabled
                >
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the student record.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(std.usn)}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </span>
        </div>
      ))}

      <Pagination className="mt-3">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) setCurrentPage((prev) => prev - 1);
              }}
              className={
                currentPage <= 1 ? "opacity-50 cursor-not-allowed" : ""
              }
            />
          </PaginationItem>
          {getPagination(currentPage, totalPages).map((item, key) => (
            <PaginationItem key={key}>
              {item === "..." ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href="#"
                  isActive={currentPage === item}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(item);
                  }}
                >
                  {item}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages)
                  setCurrentPage((prev) => prev + 1);
              }}
              className={
                currentPage >= totalPages ? "opacity-50 cursor-not-allowed" : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}

export default StudentWiseDetails;
