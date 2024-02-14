import { Schema, model } from 'mongoose';

const accountNumberSchema = new Schema({
    nameAccount: {
        type: String,
        required: true
    },
    namePerson: {
        type: String,
    },
    numberCable: {
        type: String,
    },
    numberAccount: {
        type: String,
        unique: true,
        required: true
    },
}, {
    timestamps: true,
    versionKey: false
});

export default model('AccountNumber', accountNumberSchema);