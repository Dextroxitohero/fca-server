import { Schema, model } from 'mongoose';

const colorSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    clase: {
        type: String,
        required: true
    },
    selectedClass: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

export default model('Color', colorSchema);