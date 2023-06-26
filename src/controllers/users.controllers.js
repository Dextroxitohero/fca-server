import User from '../models/User';
import upload from '../multerConfig'
import fs from 'fs';

export const createUser = async (req, res) => {
	try {

		const { data } = req.body

		// console.log(data)

		// const newUser = new User({
		// 	email: email.toLowerCase(),
		// })

		// const saveUser = await newUser.save()

		// if (saveUser === null) {
		// 	return res.status(500).json({
		// 		message: 'Server error, try again!'
		// 	})

		// }

		upload.array('files')(req, res, err => {
			try {
				const files = req.files;

				files.forEach(file => {
					// Obtener la ruta del archivo subido
					const filePath = `uploads/${file.filename}`;

					// Generar un número aleatorio
					const randomNumber = Math.floor(Math.random() * 1000);
					// Obtener el nuevo nombre del archivo utilizando el correo electrónico y el número aleatorio
					const newFileName = `tiras_lp@hotmail.com-${randomNumber}.${file.originalname.split('.').pop()}`;
					// Renombrar el archivo
					fs.rename(filePath, `uploads/${newFileName}`, err => {
						if (err) {
							console.error(err);
						}
					});

					// Aquí puedes realizar cualquier procesamiento adicional o guardar la referencia en la base de datos
					// En este ejemplo, simplemente imprimimos el nombre de cada archivo
					// console.log(newFileName);
				});
			} catch (err) {
				// Manejar el error en caso de que ocurra durante la subida de archivos
				return res.status(500).json({
					message: 'Error al subir los archivos',
				});
			}
		});

		return res.status(200).json({
			message: 'User created successfully'
		})

	} catch (err) {
		return res.status(500).json({
			message: 'Ocurrio un error, intenta de nuevo'
		})
	}
}

export const getUser = async (req, res) => {
	try {
		const user = await User.findById(req.user._id);
		console.log(user)

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

export const getAllUser = async (req, res) => {
	try {

		const user = await User.find()

		return res.status(200).json({
			data: user
		})

	} catch (error) {

		return res.status(500).json({
			message: 'Error Server'
		})

	}
}

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