import express from "express";

import {
  addShipment,
  getShipment,
  changeShipmentStatus
} from "../controllers/shipment.controller.js";

import {
  authenticate,
  authorizeRoles
} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/order/:oid",
  authenticate,
  authorizeRoles("ADMIN"),
  addShipment
);

router.get(
  "/order/:oid",
  authenticate,
  getShipment
);

router.put(
  "/:shipid/status",
  authenticate,
  authorizeRoles("ADMIN"),
  changeShipmentStatus
);

export default router;