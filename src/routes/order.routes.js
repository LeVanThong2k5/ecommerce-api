import express from "express";

import {
  addOrder,
  getMyOrders,
  getMyOrderById
} from "../controllers/order.controller.js";

import {
  authenticate
} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get(
  "/my",
  authenticate,
  getMyOrders
);

router.get(
  "/my/:oid",
  authenticate,
  getMyOrderById
);

router.post(
  "/",
  authenticate,
  addOrder
);

export default router;