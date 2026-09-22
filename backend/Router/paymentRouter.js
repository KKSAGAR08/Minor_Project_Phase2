import express from "express";
import { protectRoute } from "../Controller/authController.js";
import {
  checkPayment,
  getPaymentSession,
} from "../Controller/paymentController.js";
import bodyParser from "body-parser";
import Stripe from "stripe";

const Router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_KEY;

Router.route("/:usn/year/:year/amount/:amount").get(
  protectRoute,
  getPaymentSession
);

Router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  checkPayment
);

export default Router;
