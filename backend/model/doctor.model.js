import mongoose from "mongoose";

const availableSlotSchema = new mongoose.Schema({
    start: { type: String, required: true }, // store "10:00"
    end: { type: String, required: true },
    day: {
        type: String,
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        required: true,
    },
});


const doctorSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    name: {
        type: String,
    },
    specialization: {
        type: String,
    },
    experience: {
        type: Number,
    },
    consultationFee: {
        type: Number,
    },
    availableDays: {
        type: [String],
        enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
        ],
    },
    availableTimeSlots: {
        type: [availableSlotSchema],
    },
});

export const Doctor = mongoose.model("Doctor", doctorSchema);
