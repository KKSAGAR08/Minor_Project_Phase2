import db from "../utils/db.js";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import Email from "../utils/email.js";
import { generateToken } from "../utils/tokengeneration.js";
import crypto from "crypto";
import bcrypt from "bcrypt";

const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  if (username !== "admin" || password !== "a") {
    return res.status(401).json({ message: "Invalid Credentials" });
  }

  const user = username;

  const token = jwt.sign({ username: user }, process.env.JWT_SECRET);
  console.log(token);

  return res.json({ message: "Login Successful", token });
};

const studentLogin = async (req, res) => {
  const { usn, password } = req.body;
  try {
    const student_record = await db.query(
      "SELECT * FROM  STUDENT_DETAILS WHERE usn = $1",
      [usn]
    );

    if (student_record.rows.length === 0) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const user = student_record.rows[0];

    if (user.password === null) {
      return res.status(403).json({
        message: "You need to Register Your password Click Register Password",
      });
    }

    const passwordCheck = await bcrypt.compare(password, user.password);

    if (!passwordCheck) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign({ usn: user.usn }, process.env.JWT_SECRET);

    return res.json({ message: "Login Successful", token });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const protectRoute = async (req, res, next) => {
  let token;

  if (req.headers && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Unauthorized User" });
  }

  const data = await promisify(jwt.verify)(token, process.env.JWT_SECRET); // JWT require callback so we need to use promisify

  // Async is used because it do the task in background not block the code 


  if (data.username) {
    req.user = data;
  } else {
    const userData = await db.query(
      "SELECT * FROM STUDENT_DETAILS WHERE usn = $1",
      [data.usn]
    );
    req.user = userData.rows[0];
  }
  
  // console.log(req.user)
  next();
};

async function sendEmail(usn, student) {
  const token = await generateToken();

  const resetURL = `${process.env.FRONTENT_RESET_URL}/${usn}/${token}`;

  const email = new Email(student, resetURL);
  await email.RegisterPassword();

  return;
}

const registerPassword = async (req, res) => {
  const { usn } = req.body;
  try {
    const data = await db.query(
      "SELECT usn,student_name,student_email,password FROM student_details WHERE usn=$1",
      [usn]
    );

    if (data.rows.length === 0) {
      return res.status(404).json({
        message: "User Not Found. Contact Admin",
      });
    }

    const student = data.rows[0];

    if (student.password !== null) {
      return res.status(400).json({
        message: "You have already set your password",
      });
    }

    await sendEmail(usn, student);

    return res.status(200).json({
      message: "Password Reset Link sent to your Email",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const forgetpassword = async (req, res) => {
  const { usn } = req.body;

  const data = await db.query(
    "SELECT usn,student_name,student_email,password FROM student_details WHERE usn=$1",
    [usn]
  );

  if (data.rows.length === 0) {
    return res.status(404).json({
      message: "User Not Found. Contact Admin",
    });
  }

  const student = data.rows[0];

  await sendEmail(usn, student);

  return res.status(200).json({
    message: "Password Reset Link sent to your Email",
  });
};

const setPassword = async (req, res) => {
  const { id } = req.params;
  const { usn, password } = req.body;

  try {
    const token = crypto.createHash("sha256").update(id).digest("hex");

    const result = await db.query(
      "SELECT * FROM email_token WHERE token = $1",
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const tokenData = result.rows[0];
    if (tokenData.time < Date.now()) {
      return res.status(400).json({ message: "Token expired" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await db.query("UPDATE student_details SET password=$1 WHERE usn=$2", [
      hashedPassword,
      usn,
    ]);

    await db.query("DELETE FROM email_token WHERE token=$1", [token]);

    return res
      .status(200)
      .json({ message: "Password Set Successfully", status: true });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  adminLogin,
  studentLogin,
  protectRoute,
  registerPassword,
  forgetpassword,
  setPassword,
};
