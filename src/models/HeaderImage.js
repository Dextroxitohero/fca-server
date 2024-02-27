import { Schema, model } from 'mongoose';

const headerImageSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    }, urlName: {
        type: String,
    },
    publicId: {
        type: String,
    },
    status: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
}, {
    timestamps: true,
    versionKey: false
});

export default model('HeaderImage', headerImageSchema);