import express, { json } from "express";
import pg from "pg";
import cors from "cors";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());
const JWT_SECRET = "mySuperSecretKey123";

const db = new pg.Client({
  user: "hostel_management_daaf_user",
  host: "dpg-d1qh59gdl3ps738u23pg-a.singapore-postgres.render.com",
  database: "hostel_management_daaf",
  password: "TLaty2NHHIOZ9zT4VmsGuPOFKJ1Vxxye",
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

db.connect();

// // Apply to all requests
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: 'Too many requests from this IP, please try again after 15 minutes'
// });

// app.use(limiter); // apply rate limiter to all routes

// // Limit JSON payload to 10 KB
// app.use(express.json({ limit: '10kb' }));

// // (Optional) Limit URL-encoded payload to 10 KB
// app.use(express.urlencoded({ limit: '10kb', extended: true }));

// Sample route

app.post("/admin_login", async (req, res) => {
  const { username, password } = req.body;

  if (username !== "admin" || password !== "a") {
    return res.status(401).json({ message: "Invalid Credentials" });
  }

  const user = username;

  const token1 = jwt.sign({ username: user }, JWT_SECRET);

  return res.json({ message: "Login Successful", token1 });
});

function admintokenAuthentication(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (error, user) => {
    if (error) return res.sendStatus(403);
    next();
  });
}

app.get("/dashboard", admintokenAuthentication, (req, res) => {
  res.json({ username: "Admin" });
});

app.get("/admin_dashboard", (req, res) => {
  db.query("SELECT COUNT(USN) FROM STUDENT_DETAILS", (err, result) => {
    if (err) {
      console.log("Error executing querry", err.stack);
      return res.status(500).json({ error: "Database query failed" });
    } else {
      res.json({ data: result.rows[0].count });
    }
  });
});

app.get("/room_status", async (req, res) => {
  try {
    const occupied_rooms = await db.query(
      "select room_type,count(*) from rooms_details where occupied=true group by room_type"
    );

    const total_rooms = await db.query(
      "select room_type,count(*) from rooms_details group by room_type"
    );

    res.json({
      occupied_rooms: occupied_rooms.rows,
      total_rooms: total_rooms.rows,
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/student_details", async (req, res) => {
  try {
    const student_record = await db.query("SELECT * FROM  STUDENT_DETAILS");
    console.log(student_record);

    res.json({
      student_record: student_record.rows,
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/student_login", async (req, res) => {
  const { usn, phoneno } = req.body;
  try {
    const student_record = await db.query(
      "SELECT * FROM  STUDENT_DETAILS WHERE usn = $1 AND student_mobile_no = $2",
      [usn, phoneno]
    );

    if (student_record.rows.length === 0) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const user = student_record.rows[0];

    const token = jwt.sign({ usn: user.usn }, JWT_SECRET);

    return res.json({ message: "Login Successful", token });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

function tokenAuthentication(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (error, user) => {
    if (error) return res.sendStatus(403);

    req.user = user;
    next();
  });
}

app.get("/student_dashboard", tokenAuthentication, async (req, res) => {
  const usn = req.user.usn;

  try {
    const stdData = await db.query(
      "SELECT * FROM STUDENT_DETAILS WHERE usn = $1",
      [usn]
    );

    return res.json(stdData.rows[0]);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

async function addingNewStudent(req, res, next) {
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
}

app.post("/new_student_register", addingNewStudent, async (req, res) => {
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
});

app.get("/admin_complaint", async (req, res) => {
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
});

app.put("/update_complaint_status", async (req, res) => {
  const { complaint_id, complaint_status } = req.body;

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
});

app.delete("/delete_complaint", async (req, res) => {
  const { complaint_id } = req.body;

  console.log(complaint_id);

  try {
    await db.query("DELETE FROM complaints WHERE id = $1", [complaint_id]);
    res.json({ message: "Complaint deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete complaint" });
  }
});

app.post("/add_student_complaint", async (req, res) => {
  const { usn, roomno, title, category, description, status, date } = req.body;

  console.log(category);

  try {
    const query = await db.query(
      "INSERT INTO complaints (usn,room_no,title,description,category,status,date) VALUES ($1, $2, $3, $4, $5, $6, $7);",
      [usn, roomno, title, description, category, status, date]
    );

    res.json({ message: "Complaint Inserted successfully" });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/student_complaint_details", async (req, res) => {
  const { usn } = req.body;

  try {
    const query = await db.query(
      "SELECT id, title, status, date FROM complaints WHERE usn = $1;",
      [usn]
    );

    return res.json(query.rows); // assuming you're using pg and not mysql
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/student_roommates", async (req, res) => {
  const { usn } = req.body;

  try {
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

    return res.json(result.rows);
  } catch (error) {
    console.error("Error fetching roommates:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/count_pending_complaints", async (req, res) => {
  const { usn } = req.body;

  if (!usn) {
    return res.status(400).json({ message: "USN is required" });
  }

  try {
    const result = await db.query(
      "SELECT COUNT(*) FROM complaints WHERE usn = $1 AND status != $2",
      [usn, "Completed"]
    );

    res.json({ count: parseInt(result.rows[0].count) });
  } catch (err) {
    console.error("Error fetching not completed complaints count:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


app.post("/delete_student", async (req, res) => {
  const { usn } = req.body;
  console.log(usn)


  try {
    const result = await db.query("DELETE FROM student_details WHERE usn = $1", [usn]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error("Error deleting student:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});






app.listen(port, () => {
  console.log(`The website is running on http://localhost:${port}`);
});
