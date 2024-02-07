import Color from '../models/Color';
import Language from '../models/Language';
import Level from '../models/Level';
import User from '../models/User';
import AccountBank from '../models/AccountNumber';
import Course from '../models/Course';

export const getAllCoordinadors = async (req, res) => {
	try {

		const coordinadorList = await User.find(
			{ typeUser: 'coordinador' }, 
			'_id firstName lastName secondName'
		).exec();
		
		const coordinadorsWithFullName = coordinadorList.map(coordinador => ({
			value: coordinador._id,
			description: `${coordinador.firstName} ${coordinador.secondName || ''} ${coordinador.lastName}`
		}));

		return res.status(200).json({
			data: coordinadorsWithFullName
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
			description: language.name,
			path: language.path
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

export const getAllTeachers = async (req, res) => {
	try {
		// Modificamos la consulta para obtener solo profesores
		const teachers = await User.find({ typeUser: 'profesor' });

		const allTeachers = teachers.map(teacher => ({
			_id: teacher._id,
			name: `${teacher.firstName} ${teacher.lastName}`
		}));

		return res.status(200).json({
			data: allTeachers
		});

	} catch (error) {
		return res.status(500).json({
			message: 'Ocurrió un error, inténtalo de nuevo'
		});
	}
};

export const getAllAccountsBank = async (req, res) => {
	try {
		const accountsBank = await AccountBank.find();
		
		const allAccountsBank = accountsBank.map(accountBank => ({
			value: accountBank._id,
			description: accountBank.numberAccount,
		}));

		return res.status(200).json({
			data: allAccountsBank
		});

	} catch (error) {
		return res.status(500).json({
			message: 'Ocurrio un error, intenta de nuevo'
		});
	}
};

export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.aggregate([
            {
                $lookup: {
                    from: 'languages',
                    localField: 'language',
                    foreignField: '_id',
                    as: 'language'
                }
            },
            {
                $lookup: {
                    from: 'levels',
                    localField: 'level',
                    foreignField: '_id',
                    as: 'level'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'teacher',
                    foreignField: '_id',
                    as: 'teacher'
                }
            },
            {
                $project: {
                    language: {
                        $ifNull: [{ $arrayElemAt: ['$language.name', 0] }, '']
                    },
                    level: {
                        $ifNull: [{ $arrayElemAt: ['$level.name', 0] }, '']
                    },
                    teacher: {
                        $cond: {
                            if: { $gt: [{ $size: '$teacher' }, 0] },
                            then: {
                                $concat: [
                                    { $ifNull: [{ $arrayElemAt: ['$teacher.firstName', 0] }, ''] },
                                    ' ',
                                    { $ifNull: [{ $arrayElemAt: ['$teacher.lastName', 0] }, ''] }
                                ]
                            },
                            else: ''
                        }
                    },
                    limitMembers: { $ifNull: ['$limitMembers', ''] },
                    startDate: { $ifNull: ['$startDate', ''] },
                    endDate: { $ifNull: ['$endDate', ''] },
                    hours: { $ifNull: ['$hours', ''] },
                    days: { $ifNull: ['$days', ''] },
                    status: { $ifNull: ['$status', ''] }
                }
            }
        ]);

        return res.status(200).json( {data: courses} );

    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener la lista de cursos.',
            error
        });
    }
};