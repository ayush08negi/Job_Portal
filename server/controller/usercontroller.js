import JobApplication from '../models/jobApplication.js'
import User from '../models/User.js'
import {v2 as cloudinary} from 'cloudinary'

export const register = async(req,res)=>{
    try{
      const { name, email, password,role }  = req.body;
      const imageFile = req.file;

      if(!name || !email || !password || !role || !imageFile){
         return res.status(400).json({
            message: "Somthing missing"
         });
      };
      const user = await User.findOne({email});
      if(user){
         return res.status(400).json({
            success:false,
            message: "User already exist with this email"
         })
      }
      
      const hashPassword = await bcrypt.hash(password,10);
      await User.create({
         name, email,password,role
      })
      
    }catch(error){
         return res.status(500).json({
            success: false,
            message:error.message
         })
    }
}

export const getUserData = async(req,res)=>{
    
    const userId = req.auth.userId
    try{
        const user = await User.findById(userId)
        if(!user) {
            return res.json({
                success: false,
                message: "User Not Found"
            })
        }
        res.json({
            success:true,
            user
        })
    } catch(error){
         res.json({
            success: false,
            message: error.message
        })
    }
}

export const applyForJob = async(req,res)=>{
     
    const { jobId } = req.body
    const userId = req.auth.userId

    try{
        const isAlreadyApplied = await JobApplication.find({jobId,userId})

        if(isAlreadyApplied.length > 0){
            return res.status({
                success:false,
                message:"Already Applied"
            })
        }

        const jobData = await Job.findById(jobId)
        if(!jobData){
            return res.json({
                success: false, message: "Job Not found"
            })
        }

        await JobApplication.create({
            companyId : jobData.companyId,
            userId,
            jobId, 
            date: Date.now()
        })

        res.json({ success: true, message: "Applied Successfully"})

    }catch(error){
        res.json({ success: false, message: error.message})
    }
}

export const getUserJobApplication = async(req,res)=>{
   try{
      const userId = req.auth.userId
      const applications = await JobApplication.find({userId})
      .populate('companyId','name email image')
      .populate('jobId', 'title description location category level salary')
      .exec()

      if(!applications){
         return res.json({ success: false, message:"No job application found"})
      }
      return res.json({ success: true , applications})

   } catch(error){
    return res.json({ success: false , message: error.message})

   }
}

export const updateUserResume = async(req,res)=>{
    try{
        const userId = req.auth.userId
        const resumeFile = req.resumeFile
        const userData = await User.findById(userId)

        if(resumeFile){
            const resumeUpload = await cloudinary.uploader.upload(resumeFile.path)
            userData.resume = resumeUpload.secure_url
        }
        await userData.save()

        return res.json({ success: true, message: 'Resume Updated'})

    }catch(error){
       res.json({
        success: false,
        message: error.message
       })
    }
}