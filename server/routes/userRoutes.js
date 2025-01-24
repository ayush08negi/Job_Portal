import express from 'express'
import { applyForJob, getUserData, getUserJobApplication, register, updateUserResume ,login } from '../controller/usercontroller.js';
import upload from '../config/multer.js';
import authUser from '../middlewares/authUser.js';

const router = express.Router();

router.post('/register', register);
router.post('/login',login);

router.get('/user',authUser,getUserData)

router.post('/apply',applyForJob)

router.get('/applications',getUserJobApplication)

router.post('/update-resume',upload.single('resume'),updateUserResume);

export default router;