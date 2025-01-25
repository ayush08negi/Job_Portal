import Company from '../models/Company.js'
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from 'cloudinary'
import generateToken from '../utils/generateToken.js'
import Job from '../models/Job.js'
import JobApplication from '../models/jobApplication.js'

export const registerCompany = async(req,res) =>{
   
    const {name,email,password} = req.body;
    const image = req.file;
    
    if(!name || !email || !password || !image){
        return res.json({
            success : false,
            message : "Missing Details"
        })
    }
    try{
        const companyExists = await Company.findOne({email})

        if(companyExists){
           return res.json({
             success:false,
             message:"Company already exists"
           })
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password,salt);

        const imageUpload = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { resource_type: 'auto' },
                function (error, result) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );
            stream.end(req.file.buffer); // Upload buffer to Cloudinary
        });
        const company = await Company.create({
            name,
            email,
            password: hashPassword,
            image:imageUpload.secure_url
        })

        res.json({
            success: true,
            company : {
                _id : company._id,
                name : company.name,
                email: company.name,
                image:company.image
            },
            token : generateToken(company._id)

        })
      
    }catch(error){
      res.json({
        success:false,
        message : error.message
      })
    }

}

export const loginCompany = async(req,res)=>{
    const {email,password} = req.body
    try{
        console.log("Hii");
        const company = await Company.findOne({email})
        if(await bcrypt.compare(password,company.password)){
            res.json({
                success:true,
                company:{
                    _id : company._id,
                    name : company.name,
                    email: company.name,
                    image:company.image
                },
                token: generateToken(company._id)
            })
        } else{
            res.json({success : false, 
                message: 'Invalid email or password'
            })
        }
        
    }catch(error){
         res.json({
            success:false,
            message:error.message
         })
    }
}

export const getCompanyData = async(req,res)=>{
    const company = req.company
    try{
       res.json({
         success:true,
         company
       })
    } catch(error){
       res.json({
        success:false,
        message:error.message
       })
    }
}

export const postJob = async(req,res) =>{
     const {title ,description , location, salary, level, category} = req.body;
     
     const companyId = req.company._id

     try{
        const newJob = new Job({
            title,
            description,
            location,
            salary,
            companyId,
            date: Date.now(),
            level, 
            category
        })
        console.log(newJob)

        await newJob.save()

        res.status(200).json({
            success:true,
            newJob
        })

     }  catch(error){
        res.status(400).json({
            success:false,
            message:error.message
        })
     }
         
}

export const getCompanyJobApplicants = async(req,res)=>{
     try{
        const companyId = req.company._id
        // Find job applicaoitn for the user and populate related data
        const applications = await JobApplication.find({companyId})
        .populate('userId','name image resume')
        .populate('jobId','title location category level salary')
        .exec()

        return res.json({ success : false, applications })

     } catch(error){
        res.json({ success: false, message: error.message})

     }
   
}

export const getCompanyPostedJobs = async(req,res)=>{
   try{
     const companyId = req.company._id
     const jobs = await Job.find({ companyId })
     
     // adding no of applicants info in data
     const jobsData = await Promise.all(jobs.map(async(job) =>{
          const applicants = await JobApplication.find({jobId: job._id});
          return {
            ...job.toObject(), 
            applicants: applicants.length
        }
     }))
    return res.json({
        success:true,
        jobsData
     })
   } catch(error){
     res.json({
         success:false,
         message:error.message
     })
   }
}

export const changeJobApplicationStatus = async(req,res) =>{

}

export const changeVisiblity = async(req,res)=>{
  try{
    const {id} = req.body
    const companyId = req.company._id
    const job = await Job.findById(id)

    if(companyId.toString() == job.companyId.toString()){
        job.visible = !job.visible
    }
    await job.save();
    res.json({
        success:true,
        job
    })

  } catch(error){
     res.json({
        success: false,
        message: error.message
     })
  }
}