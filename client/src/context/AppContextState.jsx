import { toast } from "react-toastify";
import { jobsData } from "../assets/assets";
import AppContext from "./AppContext";
import React, { useEffect, useState } from 'react'
import axios  from "axios";

export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
     
    const [searchFilter,setSearchFilter] = useState({
        title:'',
        location:''
    });

    const [isSearched , setIsSearched] = useState(false);
    const [jobs,setJobs ] = useState([])
    const [showRecruiterLogin,setShowRecruiterLogin] = useState(false)
    const [companyToken, setCompanyToken] = useState(null)
    const [companyData, setCompanyData] = useState(null)
    const[userData, setUserData] = useState(null)
    const[userToken,setUserToken] = useState(null)
    const[userApplications, setUserApplications] = useState(null)

    // function t ofetch jobs 
    const fetchJobs = async () =>{
        try{
           const {data} = await axios.get(backendUrl + '/api/jobs')
           if(data.success){
             setJobs(data.jobs)
             console.log(data.jobs)
           } else{
            toast.error(data.message)
           }
        }catch(error){
           toast.error(error.message)
        }
        
    }

    const fetchUserData = async(req,res) =>{
         try{
           const{data} = await axios.get(backendUrl + 'api/users/user',
            { headers: {token: userToken}}
           )

           if(data.success){
             setUserData(data.user)
           }else{
            toast.error(data.message)
           }
           
         }catch(error){
           toast.error(error.message)
         }
    }

    //funciton to fetch company data
    const fetchCompanyData = async(req,res) =>{
        try{
            const {data} = await axios.get(backendUrl +'/api/company/company',{headers:{token:companyToken}})

            if(data.success){
               setCompanyData(data.company)
               console.log(data)
            } else{
                toast.error(data.error)
            }
        } catch(error){
            toast.error(error.message)
        }
    }

    useEffect(()=>{
         fetchJobs()
         const storedCompanyToken = localStorage.getItem('companyToken')

         if (storedCompanyToken) {
            setCompanyToken(storedCompanyToken)
         } 
    },[])

    useEffect(()=>{
         if(companyToken){
            fetchCompanyData()
         }
    },[companyToken])

    useEffect(()=>{
        if(userToken){
            fetchUserData();
        }
    },[userToken])

    const state = { 
       searchFilter,setSearchFilter,
       isSearched,setIsSearched,
       jobs,setJobs,
       showRecruiterLogin,setShowRecruiterLogin,
       companyToken,setCompanyToken,
       companyData,setCompanyData,
       userData,setUserData,
       userApplications,setUserApplications,
       userToken,setUserToken,
       backendUrl,
       fetchUserData
    }

    return (
        <AppContext.Provider value = {state}>
            {props.children}
        </AppContext.Provider>
    )
}
