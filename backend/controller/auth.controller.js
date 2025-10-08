import { Doctor } from "../model/doctor.model.js";
import bcrypt from "bcryptjs";
import generateJWTToken from "../utils/generateJWT.js";
import { Patient } from "../model/patient.model.js";

export async function doctorRegistration(req, res) {
    try {
        const { email, password } = req.body;
        if (email && password) {
            const emailExists = await Doctor.findOne({ email });
            if (emailExists) {
                return res.status(400).send("Email already exists");
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newDoctor = new Doctor({ email, password: hashedPassword });
            await newDoctor.save();
            return res.status(201).send({ message: "Doctor registered", token: generateJWTToken(newDoctor._id) });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
}

export async function doctorLogin(req,res) {
    try {
        const { email, password } = req.body;
        const doctor = await Doctor.findOne({ email });
        if (!doctor) {
            return res.status(400).send("Invalid credentials");
        }
        const isPasswordValid = await bcrypt.compare(password, doctor.password);
        if (!isPasswordValid) {
            return res.status(400).send("Invalid credentials");
        }
        res.send({ message: "doctor logged in", token: generateJWTToken(doctor._id) });
    } catch (error) {
        console.log(error)
        return res.status(500).send("Internal Server Error")
    }
}

export async function patientRegistration(req, res) {
    try {
        const { email, password } = req.body;
        if (email && password) {
            const emailExists = await Patient.findOne({ email });
            if (emailExists) {
                return res.status(400).send("Email already exists");
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newPatient = new Patient({ email, password: hashedPassword });
            await newPatient.save();
            return res.status(201).send({ message: "Patient registered", token: generateJWTToken(newPatient._id) });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
}

export async function patientLogin(req, res) {
    try {
        const { email, password } = req.body;
        const doctor = await Doctor.findOne({ email });
        if (!doctor) {
            return res.status(400).send("Invalid credentials");
        }
        const isPasswordValid = await bcrypt.compare(password, doctor.password);
        if (!isPasswordValid) {
            return res.status(400).send("Invalid credentials");
        }
        res.send({ message: "Patient logged in", token: generateJWTToken(doctor._id) });
    } catch (error) {
        console.error(error)
        res.status(500).send("Internal server error")
    }
}