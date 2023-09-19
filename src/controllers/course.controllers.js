import Course from '../models/Course';

export const getAllCourses = async (req, res) => {
    try {
        // Buscar todos los cursos en la base de datos
        const courses = await Course.find()
            .populate('language', 'name')
            .populate('level', 'name')
            .populate('color', 'name clase selectedClass');

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
        const courseId = req.params.courseId; // Obtén el ID del curso de los parámetros de la solicitud

        // Busca el curso por su ID y poblamos los campos de referencia
        const course = await Course.findById(courseId)
            .populate('language', 'name')
            .populate('level', 'name')
            .populate('color', 'name clase selectedClass');

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