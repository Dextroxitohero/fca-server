import User from '../models/User';

export const getAllAssessors = async (req, res) => {
	try {

		const assessorsList = await User.find(
			{ typeUser: 'assesor' }, 
			'_id firstName lastName secondName'
		).exec();
		
		const assessorsWithFullName = assessorsList.map(assessor => ({
			value: assessor._id,
			description: `${assessor.firstName} ${assessor.secondName || ''} ${assessor.lastName}`
		}));

		return res.status(200).json({
			data: assessorsWithFullName
		})

	} catch (error) {
		return res.status(500).json({
			message: 'Ocurrio un error, intenta de nuevo'
		})
	}
};