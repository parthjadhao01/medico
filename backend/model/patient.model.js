import mognoose from 'mongoose';

const patientSchema = new mognoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
    },
    age: {
        type: Number,
    }
});

export const Patient = mognoose.model('Patient', patientSchema);