import { Router } from 'express';

const router = Router();

import * as courseCtrl from '../controllers/course.controllers';

router.get('/', courseCtrl.getAllCourses);
router.get('/findById/:courseId', courseCtrl.getCourseById);
router.post('/', courseCtrl.createCourse);
router.put('/:courseId', courseCtrl.updateCourse);
router.delete('/:courseId', courseCtrl.deleteCourse);


export default router;