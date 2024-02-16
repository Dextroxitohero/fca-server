import Course from '../models/Course';
import User from '../models/User';

export const getAllCourses = async (req, res) => {
    const { id, roles } = req.params;

    try {
        let courses;

        // Obtener el usuario por ID para acceder a la propiedad 'courses'
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                message: 'Usuario no encontrado',
            })
        }

        if (roles === 'user') {
            courses = await Course.aggregate([
                {
                    $match: {
                        _id: { $in: user.courses },
                    },
                },
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
                        from: 'colors',
                        localField: 'color',
                        foreignField: '_id',
                        as: 'color'
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
                    $lookup: {
                        from: 'headerimages',
                        localField: 'headerImage',
                        foreignField: '_id',
                        as: 'headerImage'
                    }
                },
                {
                    $unwind: '$headerImage'
                },
                {
                    $project: {
                        language: {
                            $ifNull: [{ $arrayElemAt: ['$language.name', 0] }, '']
                        },
                        path: {
                            $ifNull: [{ $arrayElemAt: ['$language.path', 0] }, '']
                        },
                        level: {
                            $ifNull: [{ $arrayElemAt: ['$level.name', 0] }, '']
                        },
                        color: {
                            $ifNull: [{ $arrayElemAt: ['$color.clase', 0] }, '']
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
                        headerImage: {
                            _id: {
                                $ifNull: ['$headerImage._id', null]
                            },
                            urlName: {
                                $ifNull: ['$headerImage.urlName', '']
                            }
                        },
                        limitMembers: { $ifNull: ['$limitMembers', ''] },
                        fromDate: { $ifNull: ['$fromDate', ''] },
                        toDate: { $ifNull: ['$toDate', ''] },
                        hours: { $ifNull: ['$hours', ''] },
                        days: { $ifNull: ['$days', ''] },
                        status: { $ifNull: ['$status', ''] }
                    }
                }
            ]);
        } else if (roles === 'admin') {
            courses = await Course.aggregate([
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
                        from: 'colors',
                        localField: 'color',
                        foreignField: '_id',
                        as: 'color'
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
                    $lookup: {
                        from: 'headerimages',
                        localField: 'headerImage',
                        foreignField: '_id',
                        as: 'headerImage'
                    }
                },
                {
                    $unwind: '$headerImage'
                },
                {
                    $project: {
                        language: {
                            $ifNull: [{ $arrayElemAt: ['$language.name', 0] }, '']
                        },
                        path: {
                            $ifNull: [{ $arrayElemAt: ['$language.path', 0] }, '']
                        },
                        level: {
                            $ifNull: [{ $arrayElemAt: ['$level.name', 0] }, '']
                        },
                        color: {
                            $ifNull: [{ $arrayElemAt: ['$color.clase', 0] }, '']
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
                        headerImage: {
                            _id: {
                                $ifNull: ['$headerImage._id', null]
                            },
                            urlName: {
                                $ifNull: ['$headerImage.urlName', '']
                            }
                        },
                        limitMembers: { $ifNull: ['$limitMembers', ''] },
                        fromDate: { $ifNull: ['$fromDate', ''] },
                        toDate: { $ifNull: ['$toDate', ''] },
                        hours: { $ifNull: ['$hours', ''] },
                        days: { $ifNull: ['$days', ''] },
                        status: { $ifNull: ['$status', ''] }
                    }
                }
            ]);
        } else {
            return res.status(403).json({ message: 'No tienes permisos para acceder a esta información.' });
        }

        return res.status(200).json({ courses });

    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener la lista de cursos.',
            error
        });
    }
};

export const getCourseById = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        
    // Obtén el ID del curso de los parámetros de la solicitud

        // Busca el curso por su ID y poblamos los campos de referencia
        const course = await Course.findById(courseId)
            .populate('language', 'name path')
            .populate('level', 'name')
            .populate('color', 'name clase selectedClass')
            .populate('teacher', '_id firstName lastName')
            .populate('headerImage');

        if (!course) {
            return res.status(404).json({
                message: 'Curso no encontrado.'
            });
        }

        return res.status(200).json({ course });

    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener el curso.',
            error
        });
    }
};

export const createCourse = async (req, res) => {
    try {
        const courseData = req.body; // Datos del curso a agregar
        // Crear un nuevo curso en la base de datos
        const newCourse = new Course(courseData);
        await newCourse.save();

        return res.status(201).json({
            message: 'Curso agregado con éxito.',
            course: newCourse
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error al agregar el curso.',
            error
        });
    }
};

export const updateCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const updatedCourseData = req.body; // Datos actualizados del curso

        Object.keys(updatedCourseData).forEach(key => {
            if (updatedCourseData[key] === '') {
                delete updatedCourseData[key];
            }
        });

        // Buscar y actualizar el curso por su ID
        const updatedCourse = await Course.findByIdAndUpdate(courseId, updatedCourseData, { new: true });

        if (!updatedCourse) {
            return res.status(404).json({
                message: 'Curso no encontrado.'
            });
        }

        return res.status(200).json({
            message: 'Curso actualizado con éxito.',
            course: updatedCourse
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error al actualizar el curso.',
            error
        });
    }
};

export const deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Buscar y eliminar el curso por su ID
        const deletedCourse = await Course.findByIdAndRemove(courseId);

        if (!deletedCourse) {
            return res.status(404).json({
                message: 'Curso no encontrado.'
            });
        }

        return res.status(200).json({
            message: 'Curso eliminado con éxito.',
            course: deletedCourse
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error al eliminar el curso.',
            error
        });
    }
};