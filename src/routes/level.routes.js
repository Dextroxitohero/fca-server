import { Router } from 'express';

const router = Router();

import * as nivelCtrl from '../controllers/level.controllers';

router.get('/', nivelCtrl.getAllLevels);
router.post('/', nivelCtrl.addLevel);
router.put('/:levelId', nivelCtrl.updateLevel);
router.delete('/:levelId', nivelCtrl.deleteLevel);


export default router;