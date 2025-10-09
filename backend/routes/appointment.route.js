import express from "express";
import { bookAppointment, getAppointmentsByPatient, getAppointmentsByDoctor } from "../controller/appointment.controller.js";
import { doctorProtect, patientProtect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Patient books appointment
router.post("/", patientProtect, bookAppointment);

// Fetch all appointments for a specific patient
router.get("/patient/:id", patientProtect, getAppointmentsByPatient);

// Fetch all appointments for a specific doctor
router.get("/doctor/:id", doctorProtect, getAppointmentsByDoctor);

export default router;
