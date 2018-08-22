import { Router } from "express";
import User from "../models/user";
const router = Router();
import Debug from "debug";
const debug = Debug("App");

router.get("/", async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .lean();
    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id })
      .select("-password")
      .lean();
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const user = new User({
      email: req.body.email,
      password: req.body.password,
    });
    await user.save();
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error,
    });
    throw error;
  }
});

export default router;
