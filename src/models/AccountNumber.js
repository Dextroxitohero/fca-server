import { Schema, model } from 'mongoose';

const accountNumberSchema = new Schema({
    nameAccount: {
        type: String,
        unique: true,
        required: true
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