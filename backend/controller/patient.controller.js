import { Appointment } from "../model/appointment.model.js";
import { Patient } from "../model/patient.model.js";

export const getAppointments = async (req, res) => {
  try {
    const patientId = req.user._id;
    const appointments = await Appointment.find({ patient: patientId })
      .populate("doctor", "name")
      .sort({ date: -1 });

    res.json({
      success: true,
      appointments: appointments.map((a) => ({
        _id: a._id,
        doctorName: a.doctor.name,
        date: a.date,
        time: a.time,
        status: a.status,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching appointments" });
  }
};

export const updatePatientProfile = async (req,res) => {
  try {
    const patient = await Patient.findById(req.user._id)
    if(!patient) return res.status(404).json({message : "patient not found"})
    
    const {name,age} = req.body

    patient.name = name || patient.name
    patient.age = age || patient.age

    await patient.save()
    res.status(200).json({message : "Profile updated successfully",patient})
  } catch (error) {
    console.error("update profile error ",error)
    res.status(500).json({message : "Server Error"})
  }
}

// export const updateDoctorProfile = async (req, res) => {
//   try {
//     const doctor = await Doctor.findById(req.user._id);
//     if (!doctor) return res.status(404).json({ message: "Doctor not found" });

//     const { name, specialization, experience, consultationFee, availableDays } = req.body;

//     doctor.name = name || doctor.name;
//     doctor.specialization = specialization || doctor.specialization;
//     doctor.experience = experience ?? doctor.experience;
//     doctor.consultationFee = consultationFee ?? doctor.consultationFee;
//     doctor.availableDays = availableDays || doctor.availableDays;

//     await doctor.save();

//     res.status(200).json({ message: "Profile updated successfully", doctor });
//   } catch (error) {
//     console.error("Update profile error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const getPatientProfile = async (req,res) => {
  try {
    const patientId = req.user._id
    const patient = await Patient.find({_id : patientId})
    if (!patient) {
      res.status(400).send("user not found")
    }
    res.status(200).send(patient)
  } catch (error) {
    console.log("error in patient Profile route : ",error)
    res.status(500).send("Internal Server Error") 
  }
}
