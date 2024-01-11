import User from '../models/User';
import PreRegister from '../models/PreRegister';

import { BASE_URL_DEV, BASE_URL_PRODUCTION } from '../config'
import { createActivationToken } from '../libs/creationWebToken';
import { sendMail } from '../libs/sendMail';

export const createUser = async (req, res) => {
	try {

		const {
			firstName,
			lastName,
			secondName,
			email,
			phone,
			location,
			education,
			dateBirth,
			typeUser
		} = req.body

		const newUser = new User({
			firstName: firstName?.toLowerCase(),
			lastName: lastName?.toLowerCase(),
			secondName: secondName?.toLowerCase(),
			email: email?.toLowerCase(),
			phone,
			location: location?.toLowerCase(),
			education: education?.toLowerCase(),
			dateBirth,
			typeUser: typeUser?.toLowerCase()
		})

		const saveUser = await newUser.save()

		if (saveUser === null) {
			return res.status(500).json({
				message: 'Server error, try again!'
			})
		}

		return res.status(200).json({
			message: 'Usuario creado con exito',
			data: saveUser
		})

	} catch (err) {
		// console.log(err)
		return res.status(500).json({
			message: 'Ocurrio un error, intenta de nuevo'
		})
	}
}

export const getUser = async (req, res) => {
	try {
		const user = await User.findById(req.user._id);
		if (!user) {
			return res.status(400).json({
				message: "User doesn't exists"
			})
		}

		return res.status(200).json({
			success: true,
			user
		})

	} catch (error) {
		return res.status(404).json({
			message: 'User no fount'
		})
	}
}

export const getAllUsers = async (req, res) => {
	try {
		const users = await User.find({ typeUser: { $ne: 'estudiante' } },
			'-password -password -phone -location -education -dateBirth -refreshToken -updatedAt'
		).sort({ createdAt: -1 });

		const usersFormmated = users.map(user => {
			const date = new Date(user.createdAt);
			const options = { day: 'numeric', month: 'long', year: 'numeric' };
			const formatter = new Intl.DateTimeFormat('es-ES', options);
			const formattedDate = formatter.format(date);
			const [day, month] = formattedDate.split(' de ');
			const year = formattedDate.split(' ');
			const yearCut = year[year.length - 1];
			const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
			const formattedDateWithCapitalizedMonth = `${day} de ${capitalizedMonth} ${yearCut}`;

			const { _id, ...userWithoutId } = user._doc;
			return {
				id: _id,
				...userWithoutId,
				createdAtFormatted: formattedDateWithCapitalizedMonth
			};
		});

		return res.status(200).json({
			users: usersFormmated
		});

	} catch (error) {
		return res.status(500).json({
			message: 'Error al obtener la información de los usuarios'
		});
	}
};


export const updateUsersById = async (req, res) => {
	try {

		const updateUser = await User.findByIdAndUpdate(req.params.userId, req.body, {
			new: true
		})

		if (updateUser === null) {
			return res.status(404).json({
				message: 'User no fount'
			})
		}

		return res.status(200).json({
			data: updateUser
		})

	} catch (error) {

		return res.status(500).json({
			message: 'Error Server'
		})

	}
}

export const deleteUsersById = async (req, res) => {
	try {

		const deleteUser = await User.findByIdAndDelete(req.params.userId)

		if (deleteUser === null) {
			return res.status(404).json({
				message: 'User no fount'
			})
		}

		return res.status(200).json({
			data: deleteUser
		})

	} catch (error) {

		return res.status(500).json({
			message: 'Error Server'
		})

	}
}

export const createUserByInvitation = async (req, res) => {
	try {
		const { email, typeUser } = req.body;

		const foundUser = await User.findOne({ email })
		if (foundUser) {
			return res.status(409).json({
				message: 'El usuario ya se encuentra en el sistema',
				success: false
			})
		}

		const foundUserPreRegister = await PreRegister.findOne({ email })

		if (foundUserPreRegister) {
			return res.status(409).json({
				message: 'El usuario esta en proceso de pre registro.',
				success: false
			})
		}

		const newUser = { email, typeUser }

		const token = await createActivationToken(newUser);

		const activationUrl = `${BASE_URL_PRODUCTION}/nuevo-usuario/${token}`;

		await sendMail({
			email: email,
			subject: "Invitacion nuevo usuario",
			message: `Hola, para continuar con el proceso de registro, por favor ingresa al siguiente enlace: ${activationUrl}`,
		});

		return res.status(201).json({
			message: `Envio un correo electronico: ${email}, con un enlace para activar tu cuenta.`,
			success: true
		})

	} catch (error) {
		return res.status(500).json({
			message: 'Error ',
			success: false
		})
	}
}


