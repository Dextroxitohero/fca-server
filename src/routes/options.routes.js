import { Router } from 'express';

const router = Router()

import * as optionsCtrl from '../controllers/options.controllers';

router.get('/assessors', optionsCtrl.getAllAssessors)
router.get('/colors', optionsCtrl.getAllColors)
router.get('/levels', optionsCtrl.getAllLeves)
router.get('/languages', optionsCtrl.getAllLanguages)

export default router;