import express from 'express';
import {
    updateUser,
    deleteUser,
    getallUser,
    getsingleUser,
    getUserProfile,
    getMyAppointments
} from '../controllers/userController.js'

import { authenicate, restrict } from '../auth/verifytoken.js';
const router = express.Router();

router.get('/:id', authenicate, restrict(["patient"]), getsingleUser)
router.get('/', authenicate, restrict(["admin"]), getallUser)
router.put('/:id', authenicate, restrict(["patient"]), updateUser)
router.delete('/:id', authenicate, restrict(["patient"]), deleteUser)
router.get('/profile/me', authenicate, restrict(["patient"]), getUserProfile)
router.get('/appointments/my-appointments', authenicate, restrict(["patient"]), getMyAppointments)


export default router;