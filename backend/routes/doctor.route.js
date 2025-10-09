import express from "express";
import { doctorProtect } from "../middleware/auth.middleware.js";
import { addTimeSlot, getDoctorProfile, updateDoctorProfile } from "../controller/doctor.controller.js";
import { Doctor } from "../model/doctor.model.js";

const router = express.Router();

router.get("/profile", doctorProtect, getDoctorProfile);

router.put("/update-profile", doctorProtect, updateDoctorProfile);

router.post("/add-slot", doctorProtect, addTimeSlot);

// ✅ new route: get all doctors
router.get("/", async (req, res) => {
  try {
    console.log("hello from doctor route")
    const doctors = await Doctor.find();
    console.log(doctors)
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ new route: get doctor by id
router.get("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

