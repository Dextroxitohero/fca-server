import { Schema, model, Types } from 'mongoose'; // Añade Types aquí

const chatSchema = new Schema({
    messages: [
        {
            _id: {
                type: Schema.Types.ObjectId,
                default: () => new Types.ObjectId(), // Modificado aquí
            },
            sender: {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
            content: String,
            url: String,
            timestamp: {
                type: Date,
                default: Date.now,
            },
            messageType: {
                type: String,
                enum: ['text', 'url', 'file', 'image'],
                default: 'text',
            },
        },
    ],
    participants: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    courseId: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        unique: true,
    },
}, {
    timestamps: true,
    versionKey: false
});

export default model('Chat', chatSchema);