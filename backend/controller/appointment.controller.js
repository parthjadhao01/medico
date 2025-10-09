// import { Appointment } from "../models/appointment.model.js";
import { Appointment } from "../model/appointment.model.js";
// import { Doctor } from "../models/doctor.model.js";
// import { Patient } from "../models/patient.model.js";

export const bookAppointment = async (req, res) => {
  try {
    console.log("hello from book appoitnment")
    const { doctorId, patientId,patientName,date, slotTime } = req.body;
    console.log(req.body)
    // check if slot is already booked
    const existing = await Appointment.findOne({ doctorId, date, slotTime });
    if (existing)
      return res.status(400).json({ message: "Slot already booked" });

    const newAppointment = await Appointment.create({
      doctorId,
      patientId,
      date,
      patientName,
      slotTime,
      status: "Pending",
    });

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment: newAppointment,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAppointmentsByPatient = async (req, res) => {
  try {
    const { id } = req.params;
    const appointments = await Appointment.find({ patientId: id }).populate("doctorId", "name specialization consultationFee");
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAppointmentsByDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const appointments = await Appointment.find({ doctorId: id }).populate("patientId", "name email");
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
