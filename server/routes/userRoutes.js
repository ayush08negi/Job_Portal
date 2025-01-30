import express from 'express'
import { applyForJob, getUserData, getResumeData, getUserJobApplication, register, updateUserResume ,login } from '../controller/usercontroller.js';
import upload from '../config/multer.js';
import { authUser } from '../middlewares/authUser.js'

const router = express.Router();

router.post('/register', register);
router.post('/login',login);

router.get('/user/:email',authUser,getUserData)

router.post('/apply',applyForJob)

router.get('/applications',getUserJobApplication)

router.post('/update-resume',upload.single('resumeFile'),updateUserResume);
router.get('/getresume/:email',authUser,getResumeData)

export default router;