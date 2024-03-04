import Chat from '../models/Chat';
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

        // Verificar si el profesor (teacher) existe y obtener su ID
        const teacherId = courseData.teacher ? courseData.teacher : null;

        // Crear un nuevo curso en la base de datos
        const newCourse = new Course(courseData);
        await newCourse.save();

        // Crear un nuevo chat asociado al curso
        const chatParticipants = [teacherId].filter(Boolean);
        const newChat = new Chat({ participants: chatParticipants, courseId: newCourse._id });
        await newChat.save();

        // Asignar el idChat al curso
        newCourse.idChat = newChat._id;
        await newCourse.save();

        // Agregar el courseId al usuario teacher
        if (teacherId) {
            const teacher = await User.findById(teacherId);

            if (teacher) {
                teacher.courses.push(newCourse._id);
                await teacher.save();
            }
        }

        return res.status(201).json({
            message: 'Curso agregado con éxito.',
            course: newCourse,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error al agregar el curso.',
            error,
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

        // Buscar curso por su ID
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                message: 'Curso no encontrado.'
            });
        }

        if (updatedCourseData.teacher) {
            // Verificar si el curso actual ya tiene un profesor asignado
            const currentTeacherId = course.teacher || null;
            const newTeacherId = updatedCourseData.teacher || null;

            //Obtener el chat del curso
            const newChat = await Chat.findById(course.idChat);

            if (updatedCourseData.teacher && course.teacher) {

                const currentTeacher = await User.findById(currentTeacherId);
                const newTeacher = await User.findById(newTeacherId._id);

                // Eliminar el curso de la lista de cursos del profesor actual
                if (currentTeacher && currentTeacher.courses.includes(courseId)) {
                    currentTeacher.courses.pull(courseId);
                    await currentTeacher.save();
                }

                //Agregar el curso a la lista de cursos del nuevo profesor si aún no está presente
                if (newTeacher && !newTeacher.courses.includes(courseId)) {
                    newTeacher.courses.push(courseId);
                    await newTeacher.save();
                }

                //Remover al profesor actual del chat del curso
                if (currentTeacherId && newChat.participants.includes(currentTeacherId.toString())) {
                    newChat.participants.pull(currentTeacherId);
                    await newChat.save();
                }

                //Agregar al chat del curso al nuevo profesor
                if (newTeacherId && !newChat.participants.includes(newTeacherId._id.toString())) {
                    newChat.participants.push(newTeacherId._id);
                    await newChat.save();
                }

            } else if (updatedCourseData.teacher && !course.teacher) {
                const newTeacher = await User.findById(newTeacherId._id);

                if (newTeacher && !newTeacher.courses.includes(courseId)) {
                    newTeacher.courses.push(courseId);
                    await newTeacher.save();
                }

                //Agregar al chat del curso al nuevo profesor
                if (newTeacherId && !newChat.participants.includes(newTeacherId._id.toString())) {
                    newChat.participants.push(newTeacherId._id);
                    await newChat.save();
                }

            }

        }

        // Actualizar el curso con los nuevos datos
        const updatedCourse = await Course.findByIdAndUpdate(courseId, updatedCourseData, { new: true });

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


export const getListStudentsByIdCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Buscar el curso por su idCourse
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                message: 'No se encontró el curso con el idCourse proporcionado.',
            });
        }

        // Obtener los estudiantes del curso
        const students = await User.find({ _id: { $in: course.students } }, {
            avatarUrl: 1,
            matricula: 1,
            firstName: 1,
            secondName: 1,
            lastName: 1,
            secondSurname: 1,
        });

        return res.status(200).json({
            students,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener los estudiantes del curso.',
            error,
        });
    }
}

export const addNewStudentToCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { userId } = req.body;

        // Buscar el curso por su idCourse
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                message: 'No se encontró el curso con el idCourse proporcionado.',
            });
        }

        // Verificar si el usuario ya está en el curso
        if (course.students.includes(userId)) {
            return res.status(400).json({
                message: 'El estudiante ya está inscrito en este curso.',
            });
        }

        // Verificar si hay cupo disponible (limitStudents mayor a 0)
        if (course.limitMembers <= 0) {
            return res.status(400).json({
                message: 'No hay cupo disponible en este curso.',
            });
        }

        // Verificar si el estudiante (usuario) existe
        const existingUser = await User.findById(userId);

        if (!existingUser) {
            return res.status(404).json({
                message: 'No se encontró al estudiante con el id proporcionado.',
            });
        }

        // Restar 1 al campo limitMembers
        course.limitMembers -= 1;

        // Agregar el estudiante al curso
        course.students.push(userId);

        // Guardar los cambios en el curso
        await course.save();

        // Agregar el estudiante como participante en el chat
        const chat = await Chat.findOneAndUpdate(
            { courseId },
            { $addToSet: { participants: userId } },
            { new: true, upsert: true } // Crea el chat si no existe
        );

        // Actualizar el campo courses del usuario
        const updatedUser = await User.findByIdAndUpdate(userId,
            { $push: { courses: courseId } }, { new: true }
        );

        // Obtener la lista actualizada de estudiantes del curso con los campos deseados
        const updatedStudentsList = await User.find(
            { _id: { $in: course.students } },
            { matricula: 1, firstName: 1, secondName: 1, lastName: 1, secondSurname: 1 }
        );

        return res.status(200).json({
            message: 'Estudiante agregado al curso y al chat exitosamente.',
            students: updatedStudentsList,
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Error al agregar el estudiante al curso.',
            error,
        });
    }
}

export const removeStudentFromCourse = async (req, res) => {
    try {
        const { courseId, userId } = req.params;

        // Buscar el curso por su idCourse
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                message: 'No se encontró el curso con el idCourse proporcionado.',
            });
        }

        // Verificar si el usuario está inscrito en el curso
        if (!course.students.includes(userId)) {
            return res.status(400).json({
                message: 'El estudiante no está inscrito en este curso.',
            });
        }

        // Incrementar en 1 el campo limitMembers
        course.limitMembers += 1;

        // Eliminar el estudiante del curso
        course.students = course.students.filter(studentId => studentId.toString() !== userId);

        // Guardar los cambios en el curso
        await course.save();

        // Actualizar el campo courses del usuario
        await User.findByIdAndUpdate(userId, { $pull: { courses: courseId } });

        // Eliminar al estudiante del campo participants en el modelo Chat
        await Chat.findOneAndUpdate(
            { courseId },
            { $pull: { participants: userId } },
            { new: true }
        );

        // Obtener la lista actualizada de estudiantes del curso con los campos deseados
        const updatedStudentsList = await User.find(
            { _id: { $in: course.students } },
            { matricula: 1, firstName: 1, secondName: 1, lastName: 1, secondSurname: 1 }
        );

        return res.status(200).json({
            message: 'Estudiante eliminado del curso exitosamente.',
            updatedStudents: updatedStudentsList,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error al eliminar el estudiante del curso.',
            error,
        });
    }
};


export const getStudentsNotInCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Obtener el curso por su idCourse
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                message: 'No se encontró el curso con el idCourse proporcionado.',
            });
        }

        // Obtener todos los usuarios con typeUser igual a 'estudiante'
        const students = await User.find(
            { typeUser: 'estudiante' },
            { _id: 1, matricula: 1, firstName: 1, secondName: 1, lastName: 1, secondSurname: 1 }
        );

        // Filtrar los estudiantes que ya están inscritos en el curso
        const studentsNotInCourse = students.filter(student => !course.students.includes(student._id));

        // Crear la lista con el formato deseado
        const formattedStudents = studentsNotInCourse.map(student => ({
            id: student._id,
            name: `${student.firstName} ${student.secondName || ''} ${student.lastName || ''} ${student.secondSurname || ''}`,
            description: `${student.firstName} ${student.secondName || ''} ${student.lastName || ''} ${student.secondSurname || ''}`,
        }));

        return res.status(200).json({
            students: formattedStudents,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener la lista de estudiantes.',
            error,
        });
    }
};
