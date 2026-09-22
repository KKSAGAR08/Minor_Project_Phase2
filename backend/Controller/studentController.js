import express from "express";
import db from "../utils/db.js";
import { isSameYear, endOfYear, startOfYear, addYears } from "date-fns";
import cloudinary from "../utils/cloudinary.js";

const studentDashboardDetails = async (req, res) => {
  const usn = req.user.usn;

  try {
    const stdData = await db.query(
      "SELECT * FROM STUDENT_DETAILS WHERE usn = $1",
      [usn]
    );

    const availability = await db.query(
      `
      SELECT isavailable 
      FROM student_attendence
      WHERE serial_no = (
      SELECT serial_no 
      FROM student_attendence 
      WHERE usn = $1 
      ORDER BY serial_no DESC 
      LIMIT 1
      );
      `,
      [usn]
    );

    const query = `
      SELECT 
        s.usn AS student_usn,
        s.student_name AS student_name,
        r.room_type,
        rm.usn AS roommate_usn,
        rm.student_name AS roommate_name,
        rm.student_mobile_no
      FROM 
        student_details s
      JOIN 
        rooms_details r ON s.room_no = r.room_no
      JOIN 
        student_details rm ON s.room_no = rm.room_no AND s.usn != rm.usn
      WHERE 
        s.usn = $1
    `;

    const result = await db.query(query, [usn]);

    const complaints = await db.query(
      "SELECT COUNT(*) FROM complaints WHERE usn = $1 AND status != $2",
      [usn, "Completed"]
    );

   const attendenceForCurrentYear = await db.query(
      "SELECT SUM(days) FROM student_attendence WHERE usn=$1 AND EXTRACT(YEAR FROM checkindate) = EXTRACT(YEAR FROM CURRENT_DATE);",[usn]
    );

    const thisYearFee = attendenceForCurrentYear.rows[0].sum * 200;

    return res.json({
      studentDetails: stdData.rows[0],
      availability: availability.rows[0],
      roommates: result.rows,
      pendingComplaints: complaints.rows[0].count,
      currentYearFee:thisYearFee
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const addStudentComplaint = async (req, res) => {
  const { usn, roomno, title, category, description, status, date } = req.body;

  try {
    const query = await db.query(
      "INSERT INTO complaints (usn,room_no,title,description,category,status,date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;",
      [usn, roomno, title, description, category, status, date]
    );

    res.json({
      message: "Complaint Inserted successfully",
      data: query.rows[0],
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
<Question ID="1" Shortcut="Q1" Order="" ElementType="question" QuestionType="open" Anonymity="1" AllowDK="1" Translated="0" >
<LongCaption></LongCaption>
<Routings>
</Routings>
</Question>

const getStudentComplaint = async (req, res) => {
  const usn = req.params.id;

  try {
    const query = await db.query(
      "SELECT id, title, status, date FROM complaints WHERE usn = $1;",
      [usn]
    );

    return res.json(query.rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const studentCheckout = async (req, res) => {
  const { usn, room_no } = req.user;
  var { checkOutDate, expCheckinDate, reason } = req.body;

  try {
    const check = await db.query(
      `SELECT serial_no, checkindate, isavailable,addtionalreason 
       FROM student_attendence 
       WHERE serial_no = (
         SELECT serial_no 
         FROM student_attendence 
         WHERE usn = $1 AND roomno = $2 
         ORDER BY serial_no DESC LIMIT 1
       );`,
      [usn, room_no]
    );

    if (check.rowCount === 0 || check.rows[0].isavailable === false) {
      return res.status(400).json({ message: "You have not checked IN yet" });
    }

    const checkInDate = new Date(check.rows[0].checkindate);
    checkOutDate = new Date(checkOutDate);

    if (checkOutDate < checkInDate) {
      return res.status(400).json({
        message: "Checkout date should be greater than the checkin date",
      });
    }

    let currentStart = checkInDate;
    let currentEnd = endOfYear(checkInDate);
    let serialNo = check.rows[0].serial_no;

    // Case 1: Same year
    if (isSameYear(checkInDate, checkOutDate)) {
      const days = Math.floor(
        (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
      );

      await db.query(
        `UPDATE student_attendence
           SET checkoutdate = $1,
               expcheckindate = $2,
               reason = $3,
               isavailable = $4,
               days = $5
         WHERE serial_no = $6;`,
        [checkOutDate, expCheckinDate, reason, false, days, serialNo]
      );

      return res.json({ message: "Checkout Successful (same year)" });
    }

    // Case 2+: Spanning multiple years
    while (currentEnd < checkOutDate) {
      const days =
        Math.floor((currentEnd - currentStart) / (1000 * 60 * 60 * 24)) + 1;

      if (currentStart.getTime() === checkInDate.getTime()) {
        // Update first record
        await db.query(
          `UPDATE student_attendence
             SET checkoutdate = $1,
                 expcheckindate = $2,
                 reason = $3,
                 isavailable = $4,
                 days = $5
           WHERE serial_no = $6;`,
          [currentEnd, expCheckinDate, reason, false, days, serialNo]
        );
      } else {
        // Insert new record for full year
        await db.query(
          `INSERT INTO student_attendence(usn, roomno, checkindate, checkoutdate, expcheckindate, reason,checkintime,addtionalreason,isavailable, days)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10);`,
          [
            usn,
            room_no,
            currentStart,
            currentEnd,
            expCheckinDate,
            reason,
            "00:00:00",
            check.rows[0].addtionalreason,
            false,
            days,
          ]
        );
      }

      // Move to next year
      currentStart = startOfYear(addYears(currentStart, 1));
      currentEnd = endOfYear(currentStart);
    }

    const daysLast =
      Math.floor((checkOutDate - currentStart) / (1000 * 60 * 60 * 24)) + 1;
    await db.query(
      `INSERT INTO student_attendence(usn, roomno, checkindate, checkoutdate, expcheckindate, reason, checkintime,addtionalreason,isavailable, days)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10);`,
      [
        usn,
        room_no,
        currentStart,
        checkOutDate,
        expCheckinDate,
        reason,
        "00:00:00",
        check.rows[0].addtionalreason,
        false,
        daysLast,
      ]
    );

    res.json({ message: "Checkout Successful (spanning multiple years)" });
  } catch (err) {
    console.error("Error in Checkout:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const studentCheckin = async (req, res) => {
  const { usn, room_no } = req.user;
  const { checkInDate, time, addReason } = req.body;

  try {
    const check = await db.query(
      "SELECT isavailable FROM student_attendence WHERE serial_no = (SELECT serial_no FROM student_attendence WHERE usn = $1 AND roomno = $2 ORDER BY serial_no DESC LIMIT 1);",
      [usn, room_no]
    );

    if (check.rows[0]?.isavailable && check.rows[0]?.isavailable === true) {
      return res.status(400).json({ message: "You are already in hostel" });
    }

    const result = await db.query(
      "INSERT INTO student_attendence(usn,roomno,checkindate,checkintime,addtionalreason,isavailable) VALUES ($1,$2,$3,$4,$5,$6);",
      [usn, room_no, checkInDate, time, addReason, true]
    );

    res.json({ message: "Checkin Successfull" });
  } catch (err) {
    console.error("Error Inserting value:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllTheFee = async (req, res) => {
  const usn = req.params.usn;

  try {
    const data = await db.query(
      "SELECT * FROM student_attendence WHERE USN = $1 and isavailable = $2 ORDER BY checkoutdate DESC",
      [usn, false]
    );
    const feeData = data.rows;

    const yearlyTotal = [];

    feeData.forEach((row) => {
      const year = row.checkoutdate.getFullYear();
      const amount = row.days * 200;

      let yearObj = yearlyTotal.find((y) => y.year === year);

      if (!yearObj) {
        yearObj = {
          year,
          amount: 0,
          paymentstatus: false,
          fromdate: startOfYear(row.checkoutdate),
          todate: endOfYear(row.checkoutdate),
          data: [],
        };
        yearlyTotal.push(yearObj);
      }

      // update values
      yearObj.amount += amount;
      yearObj.paymentstatus = yearObj.paymentstatus || row.payment;
      yearObj.data.push(row);
    });

    return res.status(200).json({
      message: "Successfull",
      data: {
        yearlyTotal,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateStudentDetails = async (req, res) => {
  const {
    usn,
    student_name,
    student_father_name,
    student_mother_name,
    student_mobile_no,
    permanent_address,
    profile_pic,
  } = req.body;

  let photourl = null;

  try {
    if (profile_pic) {
      const uploadPhoto = await cloudinary.uploader.upload(profile_pic);
      photourl = uploadPhoto.secure_url;
    }

    const reason = await db.query(
      `UPDATE student_details SET student_name=$1,student_father_name=$2,student_mother_name=$3,permanent_address=$4,student_mobile_no=$5,profile_pic=COALESCE($6, profile_pic) WHERE usn=$7 RETURNING *;`,
      [
        student_name,
        student_father_name,
        student_mother_name,
        permanent_address,
        student_mobile_no,
        photourl,
        usn,
      ]
    );

    const data = reason.rows[0];

    // console.log(profile_pic);
    res.status(201).json({
      status: "Success",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  addStudentComplaint,
  getStudentComplaint,
  studentDashboardDetails,
  studentCheckout,
  studentCheckin,
  getAllTheFee,
  updateStudentDetails,
};
