import express from "express";
import { patientProtect } from "../middleware/auth.middleware.js";
import { getAppointments, getPatientProfile,updatePatientProfile } from "../controller/patient.controller.js";

const router = express.Router();

router.get("/appointments", patientProtect, getAppointments);

router.get("/profile",patientProtect,getPatientProfile)

router.put("/update-profile", patientProtect, updatePatientProfile);

export default router;

