import User from '../models/User';
import upload from '../multerConfig';
import fs from 'fs';

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