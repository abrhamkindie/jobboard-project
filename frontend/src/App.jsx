 import { Routes,Route } from 'react-router-dom'
 import Header from './Components/Header.jsx' 
 import Footer from './Components/Footer.jsx'
 import { Home,SignUp,Employers,BrowseJobs,Login} from './Components/Pages/index.js' 
import { AdminDash } from './Components/Dashboards/AdminDashboard/AdminDash.jsx'
import { EmpDash } from './Components/Dashboards/EmployerDashboard/EmpDash.jsx'
import { JobSeekerDash } from './Components/Dashboards/JobSeeKerDashboard/JobSeekerDash.jsx'
import { JobPosting } from './Components/Dashboards/EmployerDashboard/JobPosting.jsx'
 
  
function App (){
  
  return (
    <> 
    <div className="">
      <p></p>
    </div>
     <Header/>
     
    <Routes>
      <Route path='/' element={< Home/>}/>
      <Route path='/signUp' element={< SignUp/>}/>
      <Route path='/login' element={< Login/>}/>
      <Route path='/employers' element={< Employers/>}/>
      <Route path='/BrowseJobs' element={< BrowseJobs/>}/>
      <Route path='/EmpDash' element={< EmpDash/>}/>
      <Route path='/AdminDash' element={< AdminDash/>}/>
      <Route path='/JobSeekerDash' element={< JobSeekerDash/>}/> 
      <Route path='/JobPosting' element={< JobPosting/>}/>
 



    </Routes>    
 
 <Footer/>

</>
  )
}

export default App