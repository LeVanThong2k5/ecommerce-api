import {
  createOrder,
  getOrdersByUser,
  getOrderById
} from "../services/order.service.js";

export async function addOrder(req, res) {
  try {
    const uid = req.user.uid;
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "items must be a non-empty array"
      });
    }

    for (const item of items) {
      if (
        !Number.isInteger(item.pid) ||
        item.pid <= 0 ||
        !Number.isInteger(item.qty) ||
        item.qty <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "pid and qty must be positive integers"
        });
      }
    }

    const order = await createOrder(uid, items);

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order
    });
  } catch (error) {
    console.error(error);

    if (error.message.startsWith("PRODUCT_NOT_FOUND:")) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    if (error.message.startsWith("INVALID_QTY:")) {
      return res.status(400).json({
        success: false,
        message: "Invalid quantity"
      });
    }

    if (error.message.startsWith("INSUFFICIENT_STOCK:")) {
      return res.status(400).json({
        success: false,
        message: "Insufficient product stock"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Cannot create order"
    });
  }
}
export async function getMyOrders(req, res) {
  try {
    const uid = req.user.uid;

    const orders = await getOrdersByUser(uid);

    return res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Cannot get orders"
    });
  }
}
export async function getMyOrderById(req, res) {
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

    if (order.uid !== req.user.uid) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission"
      });
    }

    return res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Cannot get order"
    });
  }
}