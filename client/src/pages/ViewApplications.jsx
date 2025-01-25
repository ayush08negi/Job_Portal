import React, { useContext, useEffect,useState } from 'react'
import { assets, viewApplicationsPageData } from '../assets/assets'
import AppContext from '../context/AppContext'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'

const ViewApplications = () => {

  const {backendUrl , companyToken } = useContext(AppContext)
  const [applicants,setApplicants ] = useState([])

  const fetchCompanyJobApplications = async()=>{
     try{
      const {data}  = await axios.get(backendUrl+'/api/company/applicants',
        {headers : {token : companyToken}}
      )
      if(data.success){
         setApplicants(data.applications.reverse())
      } else { 
        toast.error(data.message)
      }

     } catch(error){
        toast.error(error.message)
     }
      
     useEffect(()=>{
        if(companyToken){
          fetchCompanyJobApplications()
        }
     },[companyToken])
  }
  return(
    <div className='container mx-auto p-4'>
      <div>
        <table className='w-full max-w-4xl bg-white border border-gray-2 '>
          <thead>
            <tr className='border-b'>
               <th className='py-2 px-4 text-left'>#</th>
               <th className='py-2 px-4 text-left'>User Name</th>
               <th className='py-2 px-4 text-left max-sm:hidden'>Job Title</th>
               <th className='py-2 px-4 text-left max-sm:hidden'>Location</th>
               <th className='py-2 px-4 text-left'>Resume</th>
               <th className='py-2 px-4 text-left'>Action</th>
            </tr>
          </thead>
          <tbody>
            {applicants.filter(item => item.jobId && item.userId).map((applicant,index)=> (
              <tr key={index} className='text-gray-700'>
                <td className='py-2 px-4 border-b text-center'>{index+1}</td>
                <td className='py-2 px-4 border-b text-center flex'>
                  <img className='w-10 h-10 rounded-full mr-3 max-sm:hidden' src={applicant.imgSrc} alt="" />
                  <span>{applicant.userId.name}</span>
                </td>
                <td className='py-2 px-4 border-b max-sm:hidden'>{applicant.jobId.title}</td>
                <td className='py-2 px-4 border-b max-sm:hidden'>{applicant.jobId.location}</td>
                <td className='py-2 px-4 border-b'>
                  <a href={applicant.userId.resume} target='_blank'
                  className='bg-blue-50 text-blue-400 px-3 py-1 rounded inline-flex gap-2 items-center'>
                    Resume <img src={assets.resume_download_icon} alt="" />
                  </a>
                </td>
                <td className='py-2 px-4 border-b relative'>
                  <div className='relative inline-block text-left group '>
                  <button className='text-gray-500 action-button'>...</button>
                  <div className='z-10 hidden absolute right-0 md:left-0 top-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow group-hover:block'>
                    <button className='block w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-100'>Accept</button>
                    <button className='block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100'>Reject</button>
                  </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ViewApplications