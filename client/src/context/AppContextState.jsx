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
       showRecruiterLogin,setShowRecruiterLogin
    }

    return (
        <AppContext.Provider value = {state}>
            {props.children}
        </AppContext.Provider>
    )
}
