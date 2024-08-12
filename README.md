# AuthBackend-mern

# Backend Dependancies

express
cookie-parser
mailtrap
bcryptjs
dotenv
jsonwebtoken
mongoose
crypto

# First Step Just COpy And paste it

in every backend program where you have to first connenct the mongodb you can use boilerplate and make .env where you have your mongoUrl

Index.js

```js
import express from "express";
import { connectDB } from "./DB/connectDB.js";
import dotenv from "dotenv";
const app = express();

dotenv.config();
app.get("/", (req, res) => {
  res.send("Hello ");
});

app.listen(3000, () => {
  connectDB();
  console.log("Server is Litening 3000 port");
});
```

connectDB.js

```js
import { mongoose } from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connection Succesfull : ${conn.connection.host}`);
  } catch (error) {
    console.log("Error while connecting DB");
    process.exit(1); // 1 for failur 0 for success
  }
};
```
