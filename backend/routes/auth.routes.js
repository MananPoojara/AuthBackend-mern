// it's Router File Where We only define Our Routes 

import express from "express";
import { logout, signin, signup, verifyemail } from "../controller/auth.controller.js";

const router = express.Router();

router.post("/signup", signup)
router.post("/signin", signin)
router.post("/logout", logout)
router.post("/verify-email", verifyemail)

export default router;