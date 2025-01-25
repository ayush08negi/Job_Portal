import jwt from'jsonwebtoken'
import User from '../models/User.js'
// admin authentication middleware
const authUser=async(req,res,next)=>{


  const token =req.headers.token
   if(!token){
    return res.json({success:false,message:"Not Authorized Login"})
   }
     
try{

   const token_decode=jwt.verify(token,process.env.JWT_SECRET)
   req.body.userId=token_decode.id
   req.body = await User.findById(token_decode.id).select('-password')
   
   next()
}
catch(error){
    console.log(error)
    res.json({success:false,message:error.message})
}
}
export default authUser