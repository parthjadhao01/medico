import express from "express";
import { doctorRegistration, doctorLogin, patientLogin, patientRegistration } from "../controller/auth.controller.js";

const router = express.Router();

router.post("/register/doctor", doctorRegistration)
router.post("/login/doctor", doctorLogin)
router.post("/register/patient", patientRegistration)
router.post("/login/patient", patientLogin)

export default router;

