import JobApplication from '../models/jobApplication.js'
import User from '../models/User.js'
import { v2 as cloudinary } from 'cloudinary'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import generateToken from '../utils/generateToken.js'


export const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Somthing missing"
        });
    };
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User already exist with this email"
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt);
    

        const user = await User.create({
            name,
            email,
            password: hashPassword,
        })

        return res.status(201).json({
            success: true,
            user,
            token: generateToken(user._id)
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const login = async (req, res) => {
    try {
      
        const { email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Something in missing"
            })
        }
        // console.log(email,password);

        const user = await User.findOne({ email });
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!user || !isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: 'Incorrect email or password'
            })
        }

        const token = generateToken(user._id);

        const userdata = {
            _id: user._id,
            name: user.name,
            email: user.email,
            password: user.password,
        }
        // console.log(userdata)
        return res.status(200).json({
            success: true,
            userdata,
            token
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getUserData = async (req, res) => {
    try {
        const { userId } = req.body
        console.log(userId);
        const UserData = await User.findById(userId);
        console.log(UserData);
        res.json({ success: true, UserData })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}


export const applyForJob = async (req, res) => {

    const { jobId } = req.body
    const userId = req.auth.userId

    try {
        const isAlreadyApplied = await JobApplication.find({ jobId, userId })

        if (isAlreadyApplied.length > 0) {
            return res.status({
                success: false,
                message: "Already Applied"
            })
        }

        const jobData = await Job.findById(jobId)
        if (!jobData) {
            return res.json({
                success: false, message: "Job Not found"
            })
        }

        await JobApplication.create({
            companyId: jobData.companyId,
            userId,
            jobId,
            date: Date.now()
        })

        res.json({ success: true, message: "Applied Successfully" })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const getUserJobApplication = async (req, res) => {
    try {
        const userId = req.auth.userId
        const applications = await JobApplication.find({ userId })
            .populate('companyId', 'name email image')
            .populate('jobId', 'title description location category level salary')
            .exec()

        if (!applications) {
            return res.json({ success: false, message: "No job application found" })
        }
        return res.json({ success: true, applications })

    } catch (error) {
        return res.json({ success: false, message: error.message })

    }
}

export const updateUserResume = async (req, res) => {
    console.log(req.body)
    try {
        const {userId} = req.body
        console.log(userId)
        const resumeFile = req.File
        const userData = await User.findById(userId)

        console.log(resumeFile)

        if (resumeFile) {
            const resumeUpload = await cloudinary.uploader.upload(resumeFile.path)
            userData.resume = resumeUpload.secure_url
        }
        await userData.save()

        return res.json({ success: true, message: 'Resume Updated' })

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}