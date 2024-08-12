import express from "express";
import { connectDB } from "./DB/connectDB.js";
import dotenv from "dotenv";
const app = express();

import authRoute from './routes/auth.routes.js'

dotenv.config();
app.get("/", (req, res) => {
    res.send("Hello ");
})

app.use("/api/auth", authRoute);

app.listen(3000, () => {
    connectDB();
    console.log("Server is Litening 3000 port")
})

// 3WSJpv2lQS1mpoXN

// mongodb+srv://abhishekpujara111:3WSJpv2lQS1mpoXN@cluster0.i8nw4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0