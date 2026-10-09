import express from "express";

import {
  getProducts,
  getProduct,
  addProduct,
  editProduct,
  removeProduct
} from "../controllers/product.controller.js";

import {
  authenticate,
  authorizeRoles
} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:pid", getProduct);

router.post(
  "/",
  authenticate,
  authorizeRoles("ADMIN"),
  addProduct
);

router.put(
  "/:pid",
  authenticate,
  authorizeRoles("ADMIN"),
  editProduct
);

router.delete(
  "/:pid",
  authenticate,
  authorizeRoles("ADMIN"),
  removeProduct
);

export default router;