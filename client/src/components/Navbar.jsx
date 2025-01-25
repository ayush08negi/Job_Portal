import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import AppContext from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Navbar = () => {

  const navigate = useNavigate()
  const { userData, setUserData, userToken, setUserToken, setShowRecruiterLogin, setShowUserLogin, backendUrl } = useContext(AppContext)

  const [state, setState] = useState(null);


  const logout = () => {
    setUserData(null)
    setUserToken(null)
    localStorage.removeItem("userData")
    localStorage.removeItem("userToken")
    setShowUserLogin(false)
    toast.info('You are log out succesfully..')
    navigate('/')
  }

  const user = JSON.parse(localStorage.getItem("userData"));
  console.log(user)
  // useEffect(() => {
  //   if (user) {
  //     const userObject = JSON.parse(user); // Parse the JSON string back into an object
  //     console.log(userObject);
  //     setState(userObject.name)
  //   }
  // },[])
  

  const name = localStorage.getItem("userData")
  // useEffect(() => {
  //   const storedUserToken = localStorage.getItem("userToken")
  //   console.log(storedUserData)
  //   // setState(storedUserData)


  //   // if (storedUserToken && storedUserData) {
  //   //   setUserToken(storedUserToken); // Set token in context
  //   //   setUserData(JSON.parse(storedUserData)); // Parse and set user data in context
  //   // }
  //   console.log("hii")
  //   // const fun = async () => {
  //   //   try {
  //   //     const { data } = await axios.get(backendUrl + '/api/users/user', {
  //   //       headers: { token: `${userToken}` },
  //   //     });

  //   //     console.log("API Response:", data);

  //   //     if (data.success) {
  //   //       setUserData(data.UserData); // Update state
  //   //       toast.success("User data fetched successfully!");
  //   //     } else {
  //   //       toast.error(data.message || "Failed to fetch user data.");
  //   //     }
  //   //   } catch (error) {
  //   //     console.error("Error while fetching user data:", error);
  //   //     toast.error("An error occurred while fetching user data.");
  //   //   }
  //   // };

  //   // fun();
  // }, []);

  return (
    <div className='shadow py-4'>
      <div className='container px-4 2xl:px-20 mx-auto flex justify-between items-center'>
        <img onClick={() => navigate('/')} className='cursor-pointer' src={assets.logo} alt="" />
        {
          user &&
          <div className='flex items-center gap-3'>
            <Link to={'/applications'}>Applied Jobs</Link>
            <p> | </p>
            <p className='max-sm:hidden'> Hi,{user.name}</p>
            <div>
              <button onClick={logout} className='text-white bg-black rounded-md p-1.5 text-sm '>Logout</button>
            </div>
          </div>
        }
        <div className='flex gap-4 max-sm:text-xs'>
          <button onClick={e => setShowRecruiterLogin(true)} className='text-gray-600'>Recruiter Login</button>
          {
            !user &&
            <button onClick={e => setShowUserLogin(true)} className='bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full'>Create account</button>
          }


        </div>


      </div>
    </div>
  )
}

export default Navbar