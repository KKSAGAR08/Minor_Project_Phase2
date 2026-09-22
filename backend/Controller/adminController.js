import db from "../utils/db.js";
import jwt from "jsonwebtoken";

const checkBeforeAdding = async (req, res, next) => {
  const { roomType, roomNo, usn } = req.body;

  try {
    const room = await db.query(
      "SELECT * FROM rooms_details WHERE room_no = $1 AND room_type = $2",
      [roomNo, roomType]
    );

    if (room.rows.length === 0) {
      return res.status(400).json({ message: "Room not found" });
    }

    if (room.rows[0].occupied === true) {
      return res.status(400).json({ message: "Room already occupied" });
    } else {
      var roommembercount = parseInt(room.rows[0].no_occupance);
      roommembercount = roommembercount + 1;

      const response = await db.query(
        "UPDATE rooms_details SET no_occupance = $1 WHERE room_no = $2",
        [roommembercount, roomNo]
      );

      if (roommembercount === room.rows[0].total_occupancy) {
        await db.query(
          "UPDATE rooms_details SET occupied = $1 WHERE room_no = $2",
          [true, roomNo]
        );
      }
    }

    next();
  } catch (err) {
    console.error("Error checking room availability:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const adminDashboardDetails = async (req, res) => {
  try {
    var total_student_count = await db.query(
      "SELECT COUNT(USN) FROM STUDENT_DETAILS"
    );
    total_student_count = total_student_count.rows[0];

    var occupied_rooms = await db.query(
      "select room_type,count(*) from rooms_details where occupied=true group by room_type"
    );
    var occupied_rooms = occupied_rooms.rows;

    var total_rooms = await db.query(
      "select room_type,count(*) from rooms_details group by room_type"
    );
    var total_rooms = total_rooms.rows;

    return res.status(200).json({
      username: "Admin",
      total_student_count,
      occupied_rooms,
      total_rooms,
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllStudentsDetails = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const totalCountResult = await db.query(
      `SELECT COUNT(*) FROM student_details`
    );
    const totalRecords = parseInt(totalCountResult.rows[0].count);
    const totalPages = Math.ceil(totalRecords / limit);


    const student_record = await db.query(
      `SELECT c.*, r.room_type 
       FROM student_details AS c
       JOIN rooms_details AS r ON c.room_no = r.room_no
       ORDER BY c.usn ASC
       LIMIT $1 OFFSET $2;`,
      [limit, offset]
    );

    return res.json({
      student_record: student_record.rows,
      pagination: {
        totalRecords,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const addNewStudent = async (req, res) => {
  const {
    usn,
    stdname,
    stdemail,
    stdmobileno,
    stdfathername,
    stdmothername,
    gender,
    dob,
    address,
    roomType,
    roomNo,
  } = req.body;

  try {
    const query = await db.query(
      "INSERT INTO student_details (usn,room_no,student_name,student_email,student_father_name,student_mother_name,permanent_address,student_mobile_no,dob,gender) VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9,$10);",
      [
        usn,
        roomNo,
        stdname,
        stdemail,
        stdfathername,
        stdmothername,
        address,
        stdmobileno,
        dob,
        gender,
      ]
    );

    res.json({ message: "New Student added successfully" });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllComplaints = async (req, res) => {
  try {
    const complaintData = await db.query(
      `SELECT e.*, s.student_name 
       FROM complaints e 
       JOIN student_details s ON e.usn = s.usn`
    );

    // Get total complaint count
    const pendingCountData = await db.query(
      `SELECT COUNT(*) FROM complaints WHERE status != 'Completed'`
    );

    return res.json({
      complaints: complaintData.rows,
      totalCount: parseInt(pendingCountData.rows[0].count),
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateExistingComplaint = async (req, res) => {
  const complaint_id = req.params.id;
  const { complaint_status } = req.body;

  try {
    await db.query("UPDATE complaints SET status = $1 WHERE id = $2", [
      complaint_status,
      complaint_id,
    ]);
    res.json({ message: "Complaint status updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update complaint" });
  }
};

const deleteComplaint = async (req, res) => {
  const complaint_id = req.params.id;

  try {
    const data = await db.query("DELETE FROM complaints WHERE id = $1", [
      complaint_id,
    ]);
    if (data.rowCount > 0) {
      res.json({ message: "Complaint deleted successfully" });
    } else {
      res.json({ message: "Wrong complaint id" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete complaint" });
  }
};

const deleteStudent = async (req, res) => {
  const usn = req.params.usn;

  try {
    const data = await db.query(
      "SELECT room_no FROM student_details WHERE usn=$1",
      [usn]
    );

    if (data.rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    const roomno = data.rows[0].room_no;

    await db.query("DELETE FROM student_attendence WHERE usn = $1", [usn]);

    const result = await db.query(
      "DELETE FROM student_details WHERE usn = $1",
      [usn]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    await db.query(
      `
      UPDATE rooms_details 
      SET no_occupance = GREATEST(no_occupance - 1, 0),
      occupied = false
      WHERE room_no = $1;
      `,
      [roomno]
    );

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error("Error deleting student:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllStudentsPaymentDetails = async (req, res) => {
  try {
    const result = await db.query(`
    SELECT 
    s.student_name,s.usn,
    ad.serial_no,ad.checkoutdate,ad.days,ad.payment,ad.checkindate
    FROM 
    student_details AS s
    LEFT JOIN 
    student_attendence AS ad
    ON 
    ad.usn = s.usn;
      `);

    const data = result.rows.reduce((acc, cur) => {
      const { usn, checkoutdate, days, payment, student_name, checkindate } =
        cur;

      // ensure parent object for USN
      if (!acc[usn]) {
        acc[usn] = { student_name };
      }

      if (checkoutdate) {
        const year = new Date(checkoutdate).getFullYear();
        const startDate = new Date(checkoutdate).toDateString();
        const endDate = new Date(checkindate).toDateString();

        // ensure array for that year
        if (!acc[usn][year]) {
          acc[usn][year] = [];
        }

        // push record
        acc[usn][year].push({
          days,
          status: payment,
          startDate,
          endDate,
        });
      }

      return acc;
    }, {});

    return res.json({
      message: "Successfull",
      paymentDetails: data,
    });
  } catch (error) {
    console.error("Error deleting student:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  getAllStudentsDetails,
  deleteStudent,
  checkBeforeAdding,
  addNewStudent,
  getAllComplaints,
  deleteComplaint,
  updateExistingComplaint,
  adminDashboardDetails,
  getAllStudentsPaymentDetails,
};
