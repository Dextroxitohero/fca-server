import Course from '../models/Course';
import moment from 'moment-timezone';

export const updateOpenCoursesStatus = async () => {
    try {
        // Obtener la fecha actual en la zona horaria de la Ciudad de México
        const currentDate = moment().tz('America/Mexico_City').startOf('day');

        // También obtener cursos cuya fromDate es igual al día actual
        const openCoursesSameDay = await Course.find({
            fromDate: { $eq: currentDate.toDate() }, // fromDate igual al día actual
            status: 'abierto',
        });

        // Actualizar el estado de los cursos abiertos a "en curso"
        const updatePromises = openCoursesSameDay.map(async (course) => {
            course.status = 'en curso';
            return course.save();
        });

        // Esperar a que todas las actualizaciones se completen
        await Promise.all(updatePromises);

        // Devolver los cursos actualizados si es necesario
        // return allOpenCourses;
    } catch (error) {
        console.error('Error al actualizar cursos a "en curso":', error);
        throw error;
    }
};