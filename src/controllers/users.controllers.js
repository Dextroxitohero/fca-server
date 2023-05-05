import User from '../models/User';


export const createUser = async (req, res) => {
	try {
		const { email } = req.body
		const newUser = new User({
			email: email.toLowerCase(),
		})

		const saveUser = await newUser.save()

		if (saveUser === null) {
			return res.status(500).json({
				message: 'Server error, try again!'
			})
		}

		return res.status(200).json({
			message: 'User created successfully'
		})


	} catch (error) {

	}
}

export const getUsers = async (req, res) => {
	try {
		const users = await User.find()

		return res.status(200).json({
			data: users
		})

	} catch (error) {
		return res.status(500).json({
			message: 'Error Server'
		})

	}
}

export const getUsersById = async (req, res) => {
	try {

		const user = await User.findById(req.params.userId)

		if (user === null) {
			return res.status(404).json({
				message: 'User no fount'
			})
		}

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