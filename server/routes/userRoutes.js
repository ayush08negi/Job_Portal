import express from 'express'
import { applyForJob, getUserData, getUserJobApplication, updateUserResume } from '../controller/usercontroller.js';
import upload from '../config/multer.js';

const router = express.Router();

router.get('/user',getUserData)

router.post('/apply',applyForJob)

router.get('/applications',getUserJobApplication)

router.post('/update-resume',upload.single('resume'),updateUserResume);

export default router;