import { Doctor } from "../model/doctor.model.js";
import moment from "moment";

// -------------------- GET DOCTOR PROFILE --------------------
export const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user._id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    res.status(200).json({ doctor });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------- UPDATE DOCTOR PROFILE --------------------
export const updateDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user._id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const { name, specialization, experience, consultationFee, availableDays } = req.body;

    doctor.name = name || doctor.name;
    doctor.specialization = specialization || doctor.specialization;
    doctor.experience = experience ?? doctor.experience;
    doctor.consultationFee = consultationFee ?? doctor.consultationFee;
    doctor.availableDays = availableDays || doctor.availableDays;

    await doctor.save();

    res.status(200).json({ message: "Profile updated successfully", doctor });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------- ADD AVAILABLE TIME SLOT --------------------
export const addTimeSlot = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user._id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const { day, start, end } = req.body;

    if (!day || !start || !end) {
      return res.status(400).json({ message: "Day, start, and end are required" });
    }

    // Max slots per day
    const daySlots = doctor.availableTimeSlots.filter(slot => slot.day === day);
    if (daySlots.length >= 10) {
      return res.status(400).json({ message: "Maximum 10 slots allowed per day" });
    }

    // Validate start/end time
    const newStart = moment(start, "HH:mm");
    const newEnd = moment(end, "HH:mm");

    if (!newStart.isValid() || !newEnd.isValid() || newEnd.isSameOrBefore(newStart)) {
      return res.status(400).json({ message: "Invalid start or end time" });
    }

    // Check overlapping
    const isOverlapping = daySlots.some(slot => {
      const slotStart = moment(slot.start, "HH:mm");
      const slotEnd = moment(slot.end, "HH:mm");
      return newStart.isBefore(slotEnd) && newEnd.isAfter(slotStart);
    });

    if (isOverlapping) {
      return res.status(400).json({ message: "Slot overlaps with existing slot" });
    }

    // Add new slot
    doctor.availableTimeSlots.push({ day, start, end });
    await doctor.save();

    res.status(201).json({ message: "Slot added successfully", slots: doctor.availableTimeSlots });
  } catch (error) {
    console.error("Add slot error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------- DELETE TIME SLOT --------------------
export const deleteTimeSlot = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user._id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const { slotId } = req.params;
    const slotIndex = doctor.availableTimeSlots.findIndex(slot => slot._id.toString() === slotId);
    if (slotIndex === -1) return res.status(404).json({ message: "Slot not found" });

    doctor.availableTimeSlots.splice(slotIndex, 1);
    await doctor.save();

    res.status(200).json({ message: "Slot deleted successfully", slots: doctor.availableTimeSlots });
  } catch (error) {
    console.error("Delete slot error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

