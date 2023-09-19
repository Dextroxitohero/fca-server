import { Schema, model } from 'mongoose';

const levelSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

export default model('Level', levelSchema);