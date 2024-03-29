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
    dateBirth: {
        type: String,
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
    language: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['prospecto', 'validando', 'completado'],
        default: 'prospecto'
    },
    account: {
        type: Schema.Types.ObjectId,
        ref: 'AccountBank',    
    },
    urlName: {
        type: String,        
    },
    coordinador: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
    versionKey: false
});

export default model('PreRegister', preRegisterSchema);