import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.route.js"
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.originalUrl}`);
  next();
});


app.use("/api/auth", authRoutes);


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
