import { Schema, model } from 'mongoose';

const headerImageSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    }, urlName: {
        type: String,
    },
}, {
    timestamps: true,
    versionKey: false
});

export default model('HeaderImage', headerImageSchema);