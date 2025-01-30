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
    const [showUserLogin,setShowUserLogin] = useState(false)
    const [companyToken, setCompanyToken] = useState(null)
    const [companyData, setCompanyData] = useState(null)
    const[userData, setUserData] = useState(null)
    const[userApplications, setUserApplications] = useState([])
    const [userToken, setUserToken] = useState( null);

    useEffect(() => {
      const storedUserToken = localStorage.getItem('userToken');
      if (storedUserToken) {
        setUserToken(storedUserToken);
      }
    }, []);
  
    useEffect(() => {
      if (userToken) {
        localStorage.setItem('userToken', userToken);
      }
    }, []);
    const fetchJobs = async () =>{
      
        try{
           const {data} = await axios.get(backendUrl + '/api/jobs')
           if(data.success){
             setJobs(data.jobs)
           } else{
            toast.error(data.message)
           }
        }catch(error){
           toast.error(error.message)
        }
        
    }
   console.log(userToken)
    const fetchUserData = async () => {
      const user = JSON.parse(localStorage.getItem("userData"));
      console.log(user)
        try {
          const { data } = await axios.get(backendUrl + `/api/users/user/${user?.email}`, 
           { headers: { token: `${userToken}` } // Corrected header to send the token
          });
      
          // console.log("hello")
      
          if (data.success) {
            setUserData(data.UserData);
            console.log(userData);
          } else {
            toast.error(data.message);
          }
    
        } catch (error) {
          toast.error(error.message);
        }
      };
      
     console.log("user"+userData);
    const fetchCompanyData = async(req,res) =>{
        try{
            const {data} = await axios.get(backendUrl +'/api/company/company',
                { headers: { Authorization: `Bearer ${companyToken}` } })

            if(data.success){
               setCompanyData(data.company)
              //  console.log(data)
            } else{
                toast.error(data.error)
            }
        } catch(error){
            toast.error(error.message)
        }
    }
  
    // Function to fetch user's applied applications data
    const fetchUserApplications = async()=>{
        try{
           const {data} = await axios.get(backendUrl + '/api/users/applications',
           { headers: { token: `${userToken}` }}
           )
           if(data.success){
              setUserApplications(data.applications)
           } else{
             toast.error(data.message)
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
   

    useEffect(() => {
        const storedUserToken = localStorage.getItem('userToken');
        if (storedUserToken) {
            setUserToken(storedUserToken);
        }
    }, []);
    useEffect(()=>{
        if(userToken){
           fetchUserData();
        }
   },[])
  //  console.log('use'+userData);
    useEffect(()=>{
      const datauser = localStorage.getItem('userData');
      console.log("data " , datauser)
        if(datauser){
            console.log(7)
            fetchUserData();
            fetchUserApplications();
        }
    },[])

    
    const state = { 
       searchFilter,setSearchFilter,
       isSearched,setIsSearched,
       jobs,setJobs,
       showRecruiterLogin,setShowRecruiterLogin,
       showUserLogin,setShowUserLogin,
       companyToken,setCompanyToken,
       companyData,setCompanyData,
       userData,setUserData,
       userApplications,setUserApplications,
       userToken,setUserToken,
       backendUrl,
       fetchUserData,
       fetchUserApplications,
       fetchCompanyData
    }

    // console.log(userData + userToken);
    // console.log(23);
    return (
        <AppContext.Provider value = {state}>
            {props.children}
        </AppContext.Provider>
    )
}
