import {
  createShipment,
  getShipmentByOrderId,
  updateShipmentStatus
} from "../services/shipment.service.js";

import {
  getOrderById
} from "../services/order.service.js";

export async function addShipment(req, res) {
  try {
    const oid = Number(req.params.oid);

    if (!Number.isInteger(oid) || oid <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order id"
      });
    }

    const order = await getOrderById(oid);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    const existingShipment =
      await getShipmentByOrderId(oid);

    if (existingShipment) {
      return res.status(409).json({
        success: false,
        message: "Shipment already exists"
      });
    }

    const shipment = await createShipment(oid);

    return res.status(201).json({
      success: true,
      message: "Shipment created successfully",
      data: shipment
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Cannot create shipment"
    });
  }
}

export async function getShipment(req, res) {
  try {
    const oid = Number(req.params.oid);

    const shipment =
      await getShipmentByOrderId(oid);

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found"
      });
    }
if (
  req.user.role.rolename !== "ADMIN" &&
  shipment.order.uid !== req.user.uid
) {
  return res.status(403).json({
    success: false,
    message: "You do not have permission"
  });
}
    return res.status(200).json({
      success: true,
      data: shipment
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Cannot get shipment"
    });
  }
}

export async function changeShipmentStatus(req, res) {
  try {
    const shipid = Number(req.params.shipid);
    const { status } = req.body;

    const allowedStatuses = [
      "PENDING",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED"
    ];

    if (
      !Number.isInteger(shipid) ||
      shipid <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid shipment id"
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid shipment status"
      });
    }

    const shipment =
      await updateShipmentStatus(
        shipid,
        status
      );

    return res.status(200).json({
      success: true,
      message: "Shipment status updated successfully",
      data: shipment
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Cannot update shipment"
    });
  }
}