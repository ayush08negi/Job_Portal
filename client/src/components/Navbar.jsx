import React, { useContext, useEffect, useState } from 'react'
import {assets} from '../assets/assets'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import AppContext from '../context/AppContext'
import axios from 'axios'

const Navbar = () => {

     const navigate = useNavigate()
     let {setShowRecruiterLogin , setShowUserLogin,userData,setUserData,user,setUser,setUserToken , backendUrl} = useContext(AppContext)


     const fetchUserData = async () => {
      try {
          const { data } = await axios.get(`${backendUrl}/api/users/user`);
          console.log(data);

          if (data.success) {
              toast.success('Account created successfully!');
              setUser(true);
              setUserData(data.userdata)
          } else {
              toast.error(data.message || 'Failed to create account.');
          }
      } catch (error) {
          console.error('Error fetching user data:', error);
          toast.error('Failed to fetch user data.');
      }
  };


      const logout = ()=>{
        console.log(userData)
        setUserToken(null)
        // localStorage.removeItem('__clerk_db_jwt')
        // localStorage.removeItem('__clerk_db_jwt_3r6NAEnr')
        localStorage.clear();
        window.location.reload();
        setUserData(null)
        console.log(userData)
        setUser = false;
        navigate('/') 
     }



     useEffect(()=>{

      fetchUserData();
      if(userData){
        navigate('/')
      }
     },[])

     

  return (
    <div className='shadow py-4'>
        <div className='container px-4 2xl:px-20 mx-auto flex justify-between items-center'>
            <img onClick={()=> navigate('/')} className='cursor-pointer' src = {assets.logo} alt=""/>
            {
                userData ? <>
                <div className='flex items-center gap-3'> 
                  <Link to={'/applications'}>Applied Jobs</Link>
                  <p> | </p>
                  <p className='max-sm:hidden'> Hi, {user.name}</p>
                  <div>
                    <button onClick={logout} className='text-white bg-black rounded-md p-1.5 text-sm '>Logout</button>
                  </div>

                </div>
                </>:  <button onClick={e => setShowUserLogin(true)}  className='bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full'>Create account</button>
            }
                 <div className='flex gap-4 max-sm:text-xs'>  
                <button onClick={e => setShowRecruiterLogin(true)} className='text-gray-600'>Recruiter Login</button>
           
            
               
            </div>
            
            
        </div>
    </div>
  )
}

export default Navbar