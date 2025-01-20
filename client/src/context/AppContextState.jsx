import { jobsData } from "../assets/assets";
import AppContext from "./AppContext";
import React, { useEffect, useState } from 'react'

export const AppContextProvider = (props) => {
     
    const [searchFilter,setSearchFilter] = useState({
        title:'',
        location:''
    });

    const [isSearched , setIsSearched] = useState(false);

    const [jobs,setJobs ] = useState([])

    const [showRecruiterLogin,setShowRecruiterLogin] = useState(false)

    const [companyToken, setCompanyToken] = useState(null)
    
    const [companyData, setCompanyData] = useState(null)

    // function t ofetch jobs 
    const fetchJobs = async () =>{
          setJobs(jobsData)
    }

    useEffect(()=>{
         fetchJobs()
    },[])

    const state = { 
       searchFilter,setSearchFilter,
       isSearched,setIsSearched,
       jobs,setJobs,
       showRecruiterLogin,setShowRecruiterLogin,
       companyToken,setCompanyToken,
       companyData,setCompanyData

    }

    return (
        <AppContext.Provider value = {state}>
            {props.children}
        </AppContext.Provider>
    )
}
