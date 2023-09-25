import { Schema, model } from 'mongoose';

const languageSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    path: {
        type: String,
        unique: true,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

export default model('Language', languageSchema);