import Color from '../models/Color';
import Language from '../models/Language';
import Level from '../models/Level';
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
		});

	} catch (error) {
		return res.status(500).json({
			message: 'Ocurrio un error, intenta de nuevo'
		});
	}
};

export const getAllColors = async (req, res) => {
	try {

		const color = await Color.find();
		
		const allColors = color.map(color => ({
			value: color._id,
			description: color.name,
			clase: color.clase,
			selectedClass: color.selectedClass
		}));

		return res.status(200).json({
			data: allColors
		});

	} catch (error) {
		return res.status(500).json({
			message: 'Ocurrio un error, intenta de nuevo'
		});
	}
};

export const getAllLeves = async (req, res) => {
	try {

		const levels = await Level.find();
		
		const allLeves = levels.map(level => ({
			value: level._id,
			description: level.name
		}));

		return res.status(200).json({
			data: allLeves
		});

	} catch (error) {
		return res.status(500).json({
			message: 'Ocurrio un error, intenta de nuevo'
		});
	}
};

export const getAllLanguages = async (req, res) => {
	try {
		const languages = await Language.find();
		
		const allLanguage = languages.map(language => ({
			value: language._id,
			description: language.name
		}));

		return res.status(200).json({
			data: allLanguage
		});

	} catch (error) {
		return res.status(500).json({
			message: 'Ocurrio un error, intenta de nuevo'
		});
	}
};