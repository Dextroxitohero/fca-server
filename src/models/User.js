import { Schema, model } from 'mongoose'
import bcrypt from 'bcryptjs'


const userSchema = new Schema({
    matricula: {
        type: Number,
        unique: true,        
    },
    firstName: {
        type: String,
    },
    secondName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    secondSurname: {
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
        Admin: Number
    },
    typeUser: {
        type: String,
        enum: ['estudiante', 'profesor', 'control escolar', 'administrativo', 'desarrollador' ,'director', 'subdirector', 'coordinador', 'ventas', 'cobranza','invitado'],
        require: true
    },
}, {
    timestamps: true,
    versionKey: false
})

userSchema.pre('save', async function (next) {
    if (!this.matricula && this.matricula !== 0) {
        if (this.typeUser === 'estudiante') {
            // Genera la matrícula con numeración específica para estudiantes
            const highestMatriculaEstudiante = await this.constructor.findOne({ typeUser: 'estudiante' }, 'matricula').sort('-matricula').exec();
            this.matricula = highestMatriculaEstudiante ? highestMatriculaEstudiante.matricula + 1 : 1000;
        } else {
            // Genera la matrícula con numeración específica para otros tipos de usuario
            const highestMatriculaOtroUsuario = await this.constructor.findOne({ typeUser: { $ne: 'estudiante' } }, 'matricula').sort('-matricula').exec();
            this.matricula = highestMatriculaOtroUsuario ? highestMatriculaOtroUsuario.matricula + 1 : 1;
        }
    }
    next();
});

userSchema.statics.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}

userSchema.statics.comparePassword = async (password, recivedPassword) => {
    return await bcrypt.compare(password, recivedPassword)
}


export default model('User', userSchema)