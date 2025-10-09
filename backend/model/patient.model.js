import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  age: { type: Number },
});

export const Patient = mongoose.model("Patient", patientSchema);
