import express from 'express';
import {updateDoctor,deleteDoctor,getallDoctor,getsingleDoctor, getDoctorProfile} from '../controllers/doctorController.js'

import { authenicate ,restrict} from '../auth/verifytoken.js';
import reviewRouter from './review.js'


const router=express.Router();

//nested route
router.use('/:doctorId/reviews',reviewRouter)

router.get('/:id',getsingleDoctor)
router.get('/',getallDoctor)
router.put('/:id',authenicate,restrict(["doctor"]),updateDoctor)
router.delete('/:id',authenicate,restrict(["doctor"]),deleteDoctor)
router.get('/profile/me',authenicate,restrict(["doctor"]),getDoctorProfile)

export default router;