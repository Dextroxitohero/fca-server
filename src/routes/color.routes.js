import { Router } from 'express';

const router = Router();

import * as colorCtrl from '../controllers/color.controllers';

router.get('/', colorCtrl.getAllColors);
router.post('/', colorCtrl.addColor);
router.put('/:colorId', colorCtrl.updateColor);
router.delete('/:colorId', colorCtrl.deleteColor);


export default router;