import { Router } from "express";
const router = Router();

import { isAuthenticated } from "../modules/auth.";
import authRoute from "./auth";
import userRoute from "./user";

router.use("/auth", authRoute);

router.use(isAuthenticated);

router.use("/user", userRoute);

export default router;
