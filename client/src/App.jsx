import React, { useContext } from "react"
import { Route, Routes} from 'react-router-dom'
import Home from "./pages/Home"
import ApplyJob from './pages/AppyJob'
import Applications from "./pages/Applications"
import RecruiterLogin from "./components/RecruiterLogin"
import AppContext from "./context/AppContext"
import DashBoard from "./pages/Dashboard"
import AddJob from "./pages/AddJob"
import ManageJobs from "./pages/ManageJobs"
import ViewApplications from "./pages/ViewApplications"
import 'quill/dist/quill.snow.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import UserLogin from "./components/UserLogin"

function App() {

  const { showRecruiterLogin, companyToken, showUserLogin} = useContext(AppContext)
  return (
   <div>
    {showRecruiterLogin && <RecruiterLogin/>}
    {showUserLogin && <UserLogin/>}
    <ToastContainer/>
     <Routes>
       <Route path='/' element = {<Home/>} />
       {/* <Route path='/signup' element = {<Signup/>} /> */}
       <Route path='/apply-job/:id' element = {<ApplyJob/>} />
       <Route path='/applications' element = {<Applications/>} />
       <Route path='/dashboard' element = {<DashBoard/>} >
          { companyToken ? <>
            <Route path ='add-job' element = {<AddJob/>} />
            <Route path ='manage-job' element = {<ManageJobs/>} /> 
            <Route path ='view-applications' element = {<ViewApplications/>} />          
          </> : null
          }

       </Route>
     </Routes>
   </div>
  )
}

export default App
