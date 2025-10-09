import { Doctor } from "../model/doctor.model.js";
import { Patient } from "../model/patient.model.js";
import jwt from "jsonwebtoken";

export const doctorProtect = async (req, res, next) => {
  console.log("In doctorProtect middleware");
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await Doctor.findById(decoded.id).select("-password");
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

export const patientProtect = async (req, res, next) => {
  console.log("In patientProtect middleware");

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Token received:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded payload:", decoded);

    const patient = await Patient.findById(decoded.id).select("-password");
    if (!patient) {
      console.log("Patient not found for decoded ID:", decoded.id);
      return res.status(401).json({ message: "Not authorized, patient not found" });
    }
    console.log("patient is found : ",patient)
    req.user = patient;
    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
