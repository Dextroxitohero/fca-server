import { Router } from 'express';
const router = Router()

import * as headerImageCtrl from '../controllers/headerImage.controllers';

router.get('/', headerImageCtrl.getAllHeaderImage)
router.post('/', headerImageCtrl.addheaderImage)
router.put('/:headerImageId', headerImageCtrl.updateHeaderImage)
router.delete('/deleteHeader/:headerImageId/:publicId', headerImageCtrl.deleteHeaderImage)


export default router