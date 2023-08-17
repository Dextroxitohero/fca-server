import { Router } from 'express';

const router = Router()

import * as optionsCtrl from '../controllers/options.controllers';

router.get('/assessors', optionsCtrl.getAllAssessors)


export default router