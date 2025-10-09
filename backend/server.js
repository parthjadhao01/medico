import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.route.js"
import connectDB from "./config/db.js";
import doctorRoutes from "./routes/doctor.route.js";
import patientRoutes from "./routes/patient.route.js";
import { doctorProtect, patientProtect } from "./middleware/auth.middleware.js";
import appointmentRoutes  from "./routes/appointment.route.js";

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
app.use("/api/doctor", doctorProtect, doctorRoutes);
app.use("/api/patient", patientProtect, patientRoutes);
app.use("/api/appointments", appointmentRoutes); 

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
