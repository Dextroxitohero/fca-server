import { generatePassword } from '../libs/generatePasword';
import { sendMail } from '../libs/sendMail';
import PreRegister from '../models/PreRegister';
import User from '../models/User';

export const emailVerification = async (req, res) => {
    try {
        const {
            email
        } = req.params;

        const foundUser = await User.findOne({ email })

        if (foundUser) {
            return res.status(409).json({
                message: 'El correo electronico ya se ha registrado.',
                emailExist: false
            })
        }

        const foundUserPreRegister = await PreRegister.findOne({ email });

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
            message: `Te dejamos nuestros canal de pagos. Cuando realices tu pago puedes subir tu comprobante aqui con tu correo electronico con el que te registrastes. http://localhost:3000/pre-registro`,
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
        const preRegisters = await PreRegister.aggregate([
            {
                $lookup: {
                    from: 'users', // Nombre de la colección 'users'
                    localField: 'assessor',
                    foreignField: '_id',
                    as: 'assessorData'
                }
            },
            {
                $project: {
                    _id: 0, // Excluimos el campo _id
                    id: '$_id', // Creamos un nuevo campo id con el valor del campo _id
                    firstName: 1,
                    lastName: 1,
                    email: 1,
                    phone: 1,
                    dateBirth: 1,
                    location: 1,
                    education: 1,
                    language: 1,
                    status: 1,
                    account: 1,
                    fileName: 1,
                    createdAt: 1,
                    assessorId: { $ifNull: [{ $arrayElemAt: ['$assessorData._id', 0] }, null] },
                    assessor: {
                        $cond: {
                            if: { $gt: [{ $size: '$assessorData' }, 0] },
                            then: {
                                $concat: [
                                    { $ifNull: [{ $arrayElemAt: ['$assessorData.firstName', 0] }, ''] },
                                    ' ',
                                    { $ifNull: [{ $arrayElemAt: ['$assessorData.lastName', 0] }, ''] }
                                ]
                            },
                            else: 'sin asesor'
                        }
                    }
                }
            }
        ]).sort({ createdAt: -1 });;

        const response = preRegisters.map(register => {
            // Crear un objeto Date a partir del campo createdAt
            const date = new Date(register.createdAt);
            // Opciones de formato para el objeto DateTimeFormat
            const options = { day: 'numeric', month: 'long', year: 'numeric' };
            // Crear un objeto DateTimeFormat con el formato 'es-ES'
            const formatter = new Intl.DateTimeFormat('es-ES', options);
            // Formatear la fecha usando el objeto DateTimeFormat
            const formattedDate = formatter.format(date);
            // Dividir la fecha formateada en día y mes
            const [day, month] = formattedDate.split(' de ');
            // Obtener el año del array de palabras de la fecha formateada
            const year = formattedDate.split(' ');
            const yearCut = year[year.length - 1];
            // Capitalizar la primera letra del mes
            const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
            // Crear la fecha formateada con el mes en mayúscula y el año al final
            const formattedDateWithCapitalizedMonth = `${day} de ${capitalizedMonth} ${yearCut}`;
            // Retornar el registro original con la fecha formateada añadida
            return {
                ...register,
                createdAtFormatted: formattedDateWithCapitalizedMonth
            };
        });

        return res.status(200).json({
            data: response
        });

    } catch (error) {

        return res.status(500).json({
            message: 'Error al obtener los registros de preinscripción'
        });

    }
}

export const getPreRegisterById = async (req, res) => {
    try {
        const { preRegisterId } = req.params;

        const preRegisterFound = await PreRegister.findById(preRegisterId)
        .populate('assessor', 'firstName lastName');

        if (!preRegisterFound) {
            return res.status(404).json({
                message: 'Registro de preinscripción no encontrado'
            });
        }
        
        return res.status(200).json({
            data: preRegisterFound
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener el registro de preinscripción'
        });
    }
};


export const validatePaymentVoucher = async (req, res) => {
    try {
        const { account, id, assessor } = req.body;
        const file = req.file;
        const updatedUser = await PreRegister.findByIdAndUpdate(id,
            {
                account,
                status: 'validando',
                assessor: assessor,
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
                message: 'Comprobante de pago se ha subido exitosamente',
                success: true
            });
        }

        // Envía una respuesta al cliente
        return res.status(404).json({
            message: 'No se encontro el usuario, intente de nuevo',
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Hubo un error al validar el comprobante de pago'
        });
    }
};

