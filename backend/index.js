import express, { json } from "express";
import cors from "cors";


import authRouter from "./Router/authRouter.js";
import adminRouter from "./Router/adminRouter.js";
import studentRouter from "./Router/studentRouter.js";
import paymentRouter from "./Router/paymentRouter.js"
import db from "./utils/db.js";
import jwt from "jsonwebtoken";


const JWT_SECRET = "mySuperSecretKey123";

const app = express();



app.use(cors());

app.use((req, res, next) => {
  if (req.originalUrl === "/api/v1/student/payment/webhook") {
    next(); // leave body as raw
  } else {
    express.json({ limit: "10mb" })(req, res, next); // normal json for others
  }
});

app.use("/api/v1",authRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/student",studentRouter);
app.use("/api/v1/student/payment",paymentRouter);

export default app;
