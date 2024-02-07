import { Router } from 'express';
const router = Router()
import { upload } from '../multerConfig';



import * as headerImageCtrl from '../controllers/headerImage.controllers';

router.get('/', headerImageCtrl.getAllHeaderImage)
router.post('/', upload.single('file'), headerImageCtrl.addheaderImage)
router.put('/:headerImageId', headerImageCtrl.updateHeaderImage)
router.delete('/:headerImageId', headerImageCtrl.deleteHeaderImage)


export default router