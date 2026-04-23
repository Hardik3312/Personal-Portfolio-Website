import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// 🔗 MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

// 🚀 Test Route
app.get("/", (req, res) => {
  res.send("API Working");
});

// 🔥 Start Server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
