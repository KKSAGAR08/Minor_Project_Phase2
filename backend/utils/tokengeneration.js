import crypto from "crypto"
import db from "./db.js";


const generateToken = async () => {
  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const time = Date.now() + 10 * 60 * 1000


  try {
    await db.query('INSERT INTO email_token(token,time) VALUES($1,$2);',[hashedToken,time])

    return token;
  } catch (error) {
    console.log(error);
  }
 
};

export { generateToken };
