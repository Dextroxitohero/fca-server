import { generatePassword } from '../libs/generatePasword';
import { sendMail } from '../libs/sendMail';
import PreRegister from '../models/PreRegister';
import User from '../models/User';
import { upload } from '../multerConfig';

export const emailVerification = async (req, res) => {
    try {
        const {
            email
        } = req.params;

        const foundUser = await User.findOne({ email })

        if (foundUser) {
            return res.status(200).json({
                message: 'El usuario ya se encuentra disponible',
                emailExist: false
            })
        }

        const foundUserPreRegister = await PreRegister.findOne({ email })
        if (foundUserPreRegister) {
            return res.status(200).json({
                emailExist: true,
                userPreRegister: foundUserPreRegister
            })
        }

        return res.status(200).json({
            emailExist: true,
            userPreRegister: null
        })

    } catch (error) {
        return res.status(500).json({
            message: 'Error de servidor intenta de nuevo',
        })
    }
}


export const createPreRegister = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            dateBirth,
            location,
            education,
            language
        } = req.body;

        const foundUser = await User.findOne({ email })

        if (foundUser) {
            return res.status(500).json({
                message: 'El usuario ya se encuentra disponible',
                success: false
            })
        }

        const foundUserPreRegister = await PreRegister.findOne({ email })

        if (foundUserPreRegister) {
            return res.status(500).json({
                message: 'El usuario ya este pre registrado',
                success: false
            })
        }

        // Creamos una nueva instancia del modelo PreRegister con los datos proporcionados
        const newPreRegister = new PreRegister({
            firstName,
            lastName,
            email,
            phone,
            dateBirth,
            location,
            education,
            language
        });

        // Guardamos el nuevo usuario en la base de datos
        const savedPreRegister = await newPreRegister.save();

        await sendMail({
            email: newPreRegister.email,
            subject: "Datos de pago",
            message: `Te dejamos nuestros canal de pagos.`,
        });

        return res.status(201).json({
            message: `Hola se enviara la informacion tu correo electronico: ${email}, para que realices tu pago`,
            data: savedPreRegister,
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: 'Error al agregar el usuario',
            success: false
        })
    }
}

export const updatePreRegisterById = async (req, res) => {
    try {
        const { preRegisterId } = req.params;
        const { status } = req.body;

        // Actualizamos el estado del usuario por su ID
        const updatedUser = await PreRegister.findByIdAndUpdate(
            preRegisterId,
            { status },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const password = generatePassword()

        const hashedPassword = await User.encryptPassword(password)


        const newUser = await User.create({
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            password: hashedPassword
        })

        await sendMail({
            email: updatedUser.email,
            subject: "Validacion de pago",
            message: `Tus pago ya esta validos y tus accesos son los siguientes. User: ${updatedUser.email} y tu contrasena: ${password} `,
        });

        return res.status(200).json({
            message: 'Actulizacion del usuario se completado',
            data: newUser
        })

    } catch (error) {
        return res.status(500).json({
            message: 'Error al actualizar el estado del usuario'
        });
    }
}

export const getAllPreRegister = async (req, res) => {
    try {
        const preRegisters = await PreRegister.find();
        return res.status(200).json({
            message: "Estos son todos los candidatos",
            data: preRegisters
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener los registros de preinscripción' });
    }
}


// export const validatePaymentVoucher = async (req, res) => {
//     // Aquí puedes acceder al archivo subido con req.file
//     // Y también puedes acceder al valor del campo 'account' con req.body.account
//     console.log('Archivo subido:', req.file);
//     console.log('Cuenta:', req.body.account);

//     return res.status(200).json({ message: 'Archivo subido correctamente' });
// };

export const validatePaymentVoucher = async (req, res) => {
    try {
        const { account, id } = req.body;
        const file = req.file;

        const updatedUser = await PreRegister.findByIdAndUpdate(id,
            {
                account,
                status: 'validando',
                fileName: file.filename
            },
            {
                new: true
            }
        )



        // validación del comprobante de pago con los datos recibidos
        if (updatedUser) {


            await sendMail({
                email: updatedUser.email,
                subject: "Validacion de pago",
                message: `Tu comprobante de pago va ser valido y si todo es exitoso vas recibir un email con tus accesos.`,
            });
    


            return res.status(200).json({
                message: 'Comprobante de pago validado exitosamente',
                data: updatedUser,
                success: true
            });
        }

        // Envía una respuesta al cliente
        return res.status(404).json({
            message: 'No se encontro el usuario, intente de nuevo',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Hubo un error al validar el comprobante de pago'
        });
    }
};

