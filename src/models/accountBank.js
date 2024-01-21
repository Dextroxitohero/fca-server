import { Schema, model } from 'mongoose';

const accountBankSchema = new Schema({
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

export default model('AccountBank', accountBankSchema);