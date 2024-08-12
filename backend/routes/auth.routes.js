// it's Router File Where We only define Our Routes 

import express from "express";
import { logout, signin, signup } from "../controller/auth.controller.js";

const router = express.Router();

router.get("/signup", signup)

router.get("/signin", signin)

router.get("/logout", logout)

export default router;