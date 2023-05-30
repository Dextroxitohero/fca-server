import User from '../models/User';
import { generatePassword } from '../libs/generatePasword';
import { sendMail } from '../libs/sendMail';
import PreRegister from '../models/PreRegister';

export const createPreRegister = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, age, location, education } = req.body;

        // Creamos una nueva instancia del modelo PreRegister con los datos proporcionados
        const newPreRegister = new PreRegister({
            firstName,
            lastName,
            email,
            phone,
            age,
            location,
            education,
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
            data: savedPreRegister
        })

    } catch (error) {
        return res.status(500).json({
            message: 'Error al agregar el usuario'
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