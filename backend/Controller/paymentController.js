import express from "express";
import Stripe from "stripe";
import db from "../utils/db.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_KEY;

const getPaymentSession = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      success_url: `${process.env.FRONTEND_URL_PAYMENT}`,
      cancel_url: `${process.env.FRONTEND_URL_PAYMENT}`,
      customer_email: req.user.student_email,
      client_reference_id: `${req.params.year} ref-${req.user.usn}`,
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: req.user.student_name,
              description: `Payment of hostel fee year ${req.params.year}`,
            },
            unit_amount: parseInt(req.params.amount * 100), // amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        year: req.params.year,
        student_usn: req.user.usn,
        room_no:req.user.room_no
      },
    });

    return res.status(200).json({
      status: "success",
      session,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: error.message });
  }
};

async function updateDetailsToDB(session, paymentDate, paymentID) {
  const usn = session.metadata.student_usn;
  const year = session.metadata.year;
  const room_no = session.metadata.room_no;

  const date = new Date(paymentDate * 1000);
  const payment_date = date.toLocaleString(); 
  const amount = session.amount_total;

  try {
   
    await db.query(
      `UPDATE student_attendence
       SET payment = TRUE
       WHERE usn = $1 AND EXTRACT(YEAR FROM checkoutdate) = $2;`,
      [usn, year]
    );

   
    await db.query(
      `INSERT INTO student_payment (usn, room_no, year, amount, payment_date, payment_id)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [usn, room_no, year, amount, payment_date, paymentID]
    );

  } catch (error) {
    console.error('Error updating DB:', error);
  }
}

const checkPayment = (request, response) => {
  let event = request.body;

  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = request.headers["stripe-signature"];
    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        signature,
        endpointSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return response.sendStatus(400);
    }

    if (event.type === "checkout.session.completed") {
      // console.log(event);
      const session = event.data.object;

      if (event.data.object.payment_status === "paid") {
        updateDetailsToDB(session, event.created, event.id);
      }    
    }
    response.status(200).json({ received: true });
  }
};

export { getPaymentSession, checkPayment };
