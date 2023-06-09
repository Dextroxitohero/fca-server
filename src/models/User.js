import { Schema, model } from 'mongoose'
import bcrypt from 'bcryptjs'
import { SECRET, JWT_EXPIRES  } from '../config';


const userSchema =  new Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email:{
        type: String,
        unique: true
    },
    password:{
        type: String,
    }
},{
    timestamps: true,
    versionKey: false
})

userSchema.statics.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}

userSchema.statics.comparePassword = async (password, recivedPassword) => {
    return await bcrypt.compare(password,recivedPassword)
}

export default model('User', userSchema)