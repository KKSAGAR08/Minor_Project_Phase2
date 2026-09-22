import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const db = new pg.Client({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
});

db.connect().then(()=>console.log("Connected to Database"));

export default db