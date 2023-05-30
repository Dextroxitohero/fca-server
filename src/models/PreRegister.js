import { Schema, model } from 'mongoose';

const preRegisterSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    education: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['prospecto', 'validado', 'completado'],
        default: 'prospecto'
    }
}, {
    timestamps: true,
    versionKey: false
});

export default model('PreRegister', preRegisterSchema);