import express from "express";
import { connectDB } from "./DB/connectDB.js";
import dotenv from "dotenv";
const app = express();

import authRoute from './routes/auth.routes.js'

dotenv.config();

const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
    res.send("Hello ");
})

app.use(express.json()); //very imp it parse incoming request under req.body data in json

app.use("/api/auth", authRoute);

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is listening ${PORT} port`)
})

// 3WSJpv2lQS1mpoXN

// mongodb+srv://abhishekpujara111:3WSJpv2lQS1mpoXN@cluster0.i8nw4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0