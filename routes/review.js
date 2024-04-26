import express from 'express'
import {getAllReview,createReview} from '../controllers/reviewController.js'
import { authenicate ,restrict} from '../auth/verifytoken.js';


const router=express.Router({mergeParams:true});



router
.route('/')
.get(getAllReview)
.post(authenicate,restrict(['patient']),createReview)


export default router;