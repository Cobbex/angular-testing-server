import { Router } from "express";
import User from "../models/user";
import { getAbilities } from "../modules/abilities";
import { generateToken } from "../modules/auth.";
const router = Router();

router.post("/", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    if (email && password) {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        const passwordCorrect = await user.compare(password);
        if (passwordCorrect) {
          const rules = getAbilities(user, true);
          const token = generateToken({
            userId: user.id,
            rules,
          });
          return res.json({
            success: true,
            data: {
              user,
              token,
            },
          });
        }

        return res.status(401).json({
          success: false,
          message: "Password incorrect",
        });
      }

      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(401).json({
      success: false,
      message: "No login data",
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
