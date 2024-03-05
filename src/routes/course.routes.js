import { Router } from 'express';

const router = Router();

import * as courseCtrl from '../controllers/course.controllers';

// router.get(`/getListCourse/:userId/:roles`, courseCtrl.getCourseList);
router.get(`/getAllCourse/:userId/:roles`, courseCtrl.getAllCourses);
router.get('/findCourseById/:courseId', courseCtrl.getCourseById);
router.get('/getListStudentsCourseById/:courseId', courseCtrl.getListStudentsByIdCourse);
router.get('/getListStudentsNotInCourse/:courseId', courseCtrl.getStudentsNotInCourse);
router.put('/addStudentToCourse/:courseId', courseCtrl.addNewStudentToCourse);
router.delete('/removeStudentFromCourse/:courseId/:userId', courseCtrl.removeStudentFromCourse);

router.post('/', courseCtrl.createCourse);
router.put('/:courseId', courseCtrl.updateCourse);
router.delete('/:courseId', courseCtrl.deleteCourse);


export default router;