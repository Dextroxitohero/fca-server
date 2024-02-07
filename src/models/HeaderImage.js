import { Schema, model } from 'mongoose';

const headerImageSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    }, fileName: {
        type: String,
    },
}, {
    timestamps: true,
    versionKey: false
});

export default model('HeaderImage', headerImageSchema);