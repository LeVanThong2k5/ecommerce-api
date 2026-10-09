import express from "express";

import {
  register,
  login
} from "../controllers/auth.controller.js";

import {
  authenticate
} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/me", authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      uid: req.user.uid,
      username: req.user.username,
      fullname: req.user.fullname,
      role: req.user.role,
      membership: req.user.membership
    }
  });
});

export default router;