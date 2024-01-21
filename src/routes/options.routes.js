import { Router } from 'express';

const router = Router()

import * as optionsCtrl from '../controllers/options.controllers';

router.get('/coordinadors', optionsCtrl.getAllCoordinadors);
router.get('/colors', optionsCtrl.getAllColors);
router.get('/levels', optionsCtrl.getAllLeves);
router.get('/languages', optionsCtrl.getAllLanguages);
router.get('/teachers', optionsCtrl.getAllTeachers);
router.get('/accountsBank', optionsCtrl.getAllAccountsBank);
router.get('/coursesList', optionsCtrl.getAllCourses);

export default router;