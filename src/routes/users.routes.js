import { Router } from 'express';

const router = Router();

import * as usersCtrl from '../controllers/users.controllers';
import { authJwt } from '../middlewares';

router.get('/getAllUsers',usersCtrl.getAllUsers);
router.post('/' ,usersCtrl.createUser);
router.post('/newUserByInvitation', usersCtrl.createUserByInvitation);
// router.get('/', 
//     [
//         authJwt.verifyToken
//     ], 
// usersCtrl.getUser);
router.put('/:userId', usersCtrl.updateUsersById);
router.delete('/:userId', usersCtrl.deleteUsersById);

export default router;