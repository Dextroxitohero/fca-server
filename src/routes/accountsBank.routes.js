import { Router } from 'express';

const router = Router();

import * as accountsBankCtrl from '../controllers/accountsBank.controllers';

router.get('/', accountsBankCtrl.getAllAccountsBank);
router.post('/', accountsBankCtrl.addAccountBank);
router.put('/:accountId', accountsBankCtrl.updateAccountBank);
router.delete('/:accountId', accountsBankCtrl.deleteAccountBank);


export default router;