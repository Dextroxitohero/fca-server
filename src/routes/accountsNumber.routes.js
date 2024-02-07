import { Router } from 'express';

const router = Router();

import * as accountsNumberCtrl from '../controllers/accountsNumber.controllers';

router.get('/', accountsNumberCtrl.getAllAccountsNumber);
router.post('/', accountsNumberCtrl.addAccountNumber);
router.put('/:accountId', accountsNumberCtrl.updateAccountNumber);
router.delete('/:accountId', accountsNumberCtrl.deleteAccountNumber);


export default router;