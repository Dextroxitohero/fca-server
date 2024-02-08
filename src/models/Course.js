import { Schema, model } from 'mongoose';

const courseSchema = new Schema({
    language: {
        type: Schema.Types.ObjectId,
        ref: 'Language',
    },
    level: {
        type: Schema.Types.ObjectId,
        ref: 'Level',
    },
    color: {
        type: Schema.Types.ObjectId,
        ref: 'Color',
    },
    limitMembers: {
        type: Number,
        require: true
    },
    fromDate: {
        type: Date,
    },
    toDate: {
        type: Date,
    },
    hours: {
        type: [],
    },
    days: {
        type: [],
    },
    status: {
        type: String,
        enum: ['activo', 'inactivo'],
        default: 'inactivo'
    },
    teacher: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    headerImage: {
        type: Schema.Types.ObjectId,
        ref: 'HeaderImage',
    },
    students: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
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

export default model('Course',courseSchema);