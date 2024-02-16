import { generatePassword } from '../libs/generatePasword';
import { sendMail } from '../libs/sendMail';
import PreRegister from '../models/PreRegister';
import Course from '../models/Course';
import User from '../models/User';
import { formatDate } from '../libs/formatDate';

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
            return res.status(409).json({
                message: 'El usuario ya se encuentra disponible',
                success: false
            })
        }

        const foundUserPreRegister = await PreRegister.findOne({ email })

        if (foundUserPreRegister) {
            return res.status(409).json({
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
            template: "templateDataPayment",
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
    const { id, roles } = req.params;

    try {
        let preRegisters;

        if (roles === 'user') {
            // Filtra solo los registros que tienen relación con el ID del usuario
            preRegisters = await PreRegister.aggregate([
                {
                    $match: {
                        $expr: {
                            $eq: ["$coordinador", { $toObjectId: id }]
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'coordinador',
                        foreignField: '_id',
                        as: 'coordinadorData'
                    }
                },
                {
                    $project: {
                        _id: 0,
                        id: '$_id',
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
                        coordinadorId: { $ifNull: [{ $arrayElemAt: ['$coordinadorData._id', 0] }, null] },
                        coordinador: {
                            $cond: {
                                if: { $gt: [{ $size: '$coordinadorData' }, 0] },
                                then: {
                                    $concat: [
                                        { $ifNull: [{ $arrayElemAt: ['$coordinadorData.firstName', 0] }, ''] },
                                        ' ',
                                        { $ifNull: [{ $arrayElemAt: ['$coordinadorData.lastName', 0] }, ''] }
                                    ]
                                },
                                else: 'sin asesor'
                            }
                        }
                    }
                }
            ]);
        } else if (roles === 'admin') {
            // Trae todos los preregistros para el rol de administrador
            preRegisters = await PreRegister.aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'coordinador',
                        foreignField: '_id',
                        as: 'coordinadorData'
                    }
                },
                {
                    $project: {
                        _id: 0,
                        id: '$_id',
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
                        coordinadorId: { $ifNull: [{ $arrayElemAt: ['$coordinadorData._id', 0] }, null] },
                        coordinador: {
                            $cond: {
                                if: { $gt: [{ $size: '$coordinadorData' }, 0] },
                                then: {
                                    $concat: [
                                        { $ifNull: [{ $arrayElemAt: ['$coordinadorData.firstName', 0] }, ''] },
                                        ' ',
                                        { $ifNull: [{ $arrayElemAt: ['$coordinadorData.lastName', 0] }, ''] }
                                    ]
                                },
                                else: 'sin asesor'
                            }
                        }
                    }
                }
                // Otros pasos del pipeline si es necesario
            ]);
        } else {
            return res.status(403).json({ message: 'No tienes permisos para acceder a esta información.' });
        }

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
};

export const getPreRegisterById = async (req, res) => {
    try {
        const { preRegisterId } = req.params;

        const preRegisterFound = await PreRegister.findById(preRegisterId)
            .populate('coordinador', 'firstName lastName');

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
        const { account, id, coordinador, urlName } = req.body;
        const updatedUser = await PreRegister.findByIdAndUpdate(id,
            {
                account,
                status: 'validando',
                coordinador: coordinador,
                urlName: urlName,
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
                template: "templateValidationPayment",
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

export const validateCandidate = async (req, res) => {
    try {
        const { createdBy, paymentDeadlineDate, idCourse, idPreregister } = req.body;

        const foundPreRegister = await PreRegister.findById(idPreregister);

        if (!foundPreRegister) {
            return res.status(404).json({
                message: 'No se encontro el usuario, intente de nuevo',
            });
        }

        const foundCourse = await Course.findById(idCourse);

        let timeStart = '';
        let timeEnd = '';
        let daystart = '';
        let daysCourse = '';

        if (foundCourse) {
            const { days, hours, fromDate } = foundCourse;
            timeStart = hours[0].time;
            timeEnd = hours[hours.length - 1].time;
            daystart = fromDate;
            daysCourse = days.map(day => day.day);
        }

        if (!foundCourse) {
            return res.status(404).json({
                message: 'No se encontro el curso, intente de nuevo',
            });
        }

        const updatedPreRegister = await PreRegister.findByIdAndUpdate(idPreregister,
            {
                status: 'completado',
            },
            {
                new: true
            }
        );

        const { firstName, lastName, email, phone, location, education, dateBirth } = updatedPreRegister;

        const password = generatePassword();

        const foundUser = await User.findOne({ email })

        if (foundUser) {
            return res.status(409).json({
                message: 'El usuario ya se encuentra registrado en la plataforma'
            })
        }

        const newUser = new User({
            firstName: firstName?.toLowerCase(),
            lastName: lastName?.toLowerCase(),
            email: email,
            phone,
            location: location?.toLowerCase(),
            education: education?.toLowerCase(),
            typeUser: 'estudiante',
            dateBirth,
            password: await User.encryptPassword(password),
            updatedBy: createdBy,
            createdBy: createdBy,
            paymentDeadlineDate: paymentDeadlineDate,
        })

        const saveUser = await newUser.save()

        const { _id: studentId, matricula } = saveUser;

        // Verifica si el estudiante ya está en el curso
        if (foundCourse.students.includes(studentId)) {
            return res.status(400).json({ message: 'Este estudiante ya está inscrito en el curso.' });
        }

        // Verifica si hay espacio disponible antes de agregar al estudiante
        if (foundCourse.students.length >= foundCourse.limitMembers) {
            return res.status(400).json({ message: 'El curso está lleno. No se pueden agregar más estudiantes.' });
        }

        saveUser.courses.push(idCourse);

        foundCourse.students.push(studentId);

        foundCourse.limitMembers = foundCourse.limitMembers - 1;

        await foundCourse.save();

        await saveUser.save();

        if (saveUser === null) {
            return res.status(500).json({
                message: 'Server error, try again!'
            })
        }

        await sendMail({
            email: email,
            subject: "Bienvenido a la plataforma CFA",
            template: "templateWelcome",
            data: {
                firstName: firstName.toUpperCase(),
                lastName: lastName.toUpperCase(),
                email: email,
                matricula: matricula,
                password: password,
                timeStart: timeStart,
                timeEnd: timeEnd,
                daystart: formatDate(daystart).toUpperCase(),
                daysCourse: daysCourse.toString().replace(/,/g, ", ").toUpperCase(),
            }
        });

        return res.status(201).json({
            message: 'Tu candidatura ha sido validada, se ha enviado un correo con tus datos de acceso',
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Hubo un error al validar el comprobante de pago'
        });
    }
};