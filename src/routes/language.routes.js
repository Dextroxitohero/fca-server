import { Router } from 'express';

const router = Router();

import * as languageCtrl from '../controllers/language.controllers';

router.get('/', languageCtrl.getAllLanguages);
router.post('/', languageCtrl.addLanguage);
router.put('/:languageId', languageCtrl.updateLanguage);
router.delete('/:languageId', languageCtrl.deleteLanguage);


export default router;