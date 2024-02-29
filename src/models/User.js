import { Schema, model } from 'mongoose'
import bcrypt from 'bcryptjs'


const userSchema = new Schema({
    matricula: {
        type: Number,
        unique: true,
    },
    avatarUrl: {
        type: String,
        default: 'https://res.cloudinary.com/dax0v05jz/image/upload/v1708645791/uploads/hbzdzch5ldxw6pszwmej.png'
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
        type: String,
        enum: ['user', 'admin', 'invitado'],
        default: 'user',
    },
    courses: [{
        type: Schema.Types.ObjectId,
        ref: 'Course'
    }],
    typeUser: {
        type: String,
        enum: ['estudiante', 'profesor', 'control escolar', 'administrativo', 'desarrollador', 'director', 'subdirector', 'coordinador', 'ventas', 'cobranza', 'invitado'],
        require: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    paymentDeadlineDate: {
        type: String,
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

userSchema.pre('save', async function (next) {
    if (['estudiante', 'profesor', 'control escolar', 'coordinador', 'ventas', 'cobranza', 'invitado'].includes(this.typeUser)) {
        // Configuración de roles para usuarios específicos
        this.roles = 'user';

    } else if (['administrativo', 'desarrollador', 'director', 'subdirector'].includes(this.typeUser)) {
        // Configuración de roles para otros tipos de usuarios
        this.roles = 'admin'
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