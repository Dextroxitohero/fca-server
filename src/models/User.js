import { Schema, model } from 'mongoose'
import bcrypt from 'bcryptjs'


const userSchema = new Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    secondName: {
        type: String,
    },
    email: {
        type: String,
        unique: true
    },
    phone: {
        type: String,
    },
    location: {
        type: String,
    },
    education: {
        type: String,
    },
    dateBirth: {
        type: String,
    },
    password: {
        type: String,
    },
    roles: {
        User: {
            type: Number,
            default: 2001
        },
        Editor: Number,
        Admin: Number
    },
    typeUser: {
        type: String,
        enum: ['estudiante', 'profesor', 'control escolar', 'administrativo', 'assesor', 'directivo'],
        require: true
    },
}, {
    timestamps: true,
    versionKey: false
})

userSchema.statics.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}

userSchema.statics.comparePassword = async (password, recivedPassword) => {
    return await bcrypt.compare(password, recivedPassword)
}

export default model('User', userSchema)