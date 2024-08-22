// it's Router File Where We only define Our Routes 

import express from "express";
import { forgotpassword, logout, resetpassword, signin, signup, verifyemail } from "../controller/auth.controller.js";

const router = express.Router();

router.post("/signup", signup)
router.post("/signin", signin)
router.post("/logout", logout)
router.post("/verify-email", verifyemail)
router.post("/forgotpassword", forgotpassword);
router.post("/reset-password/:token", resetpassword);


export default router;