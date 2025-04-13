 import axios from "axios";
import { useState, useEffect, useRef } from "react";
import BASE_URL from "../../API";
import { useNavigate } from "react-router-dom";
 import ApplicationModal from "../../Modals/ApplicationModal";
import Button from "../Button";  
import {  FaBookmark} from "react-icons/fa";

 

export const SavedJobs = () => {
    const [JobList, setJobList] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);

    const [savedJobs, setSavedJobs] = useState([]);
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [showApplicationModal, setShowApplicationModal] = useState(false);
    const authToken=localStorage.getItem("authToken");
    const [activeJobId, setActiveJobId] = useState(null);

      
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState("");

  const navigate = useNavigate();
  const modal = useRef();
  const modalRef = useRef();  

  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("user_Id");
 

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      modal.current?.open();
      setTimeout(() => navigate("/login"), 1000);
    }
  }, [navigate]);

   
  useEffect(() => {
    axios
      .get(`${BASE_URL}/jobs/job_lists`)
      .then((response) => {
        if (Array.isArray(response.data) && response.data.length === 2) {
          setJobList(response.data[0]); // Jobs list
         } else {
          console.error("Unexpected API response format:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
      });
  },  );

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setActiveJobId(job.id);

   };

 
 
  

  useEffect(() => {
    setIsLoading(true);
    setError("");
    if (userId && authToken) {
      axios
        .get(`${BASE_URL}/save/saved_jobs`, { 
          params: { user_id: userId },
          headers: { 'Authorization': `Bearer ${authToken}` }

        })
        .then((response) => {
          const savedJobIds = response.data.map((job) => job.job_id);
          setSavedJobs(savedJobIds);
        })
        .catch((error) => console.error("Error fetching saved jobs:", error));
    }
    setIsLoading(false);

  }, [userId ,authToken]);

 

  const handleSaveJob = async (job) => {
    if (!userId) {
      alert("Please log in to save jobs.");
      return;
    }

    const isSaved = savedJobs.includes(job.id);
    const endpoint = isSaved ? "/unsave_job" : "/save_job";

    try {
      const response = await axios.post(
        `${BASE_URL}/save${endpoint}`,
        { job_id: job.id, user_id: userId },
        { 
          
          headers: {  
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          }        
        }
      );

      if (response.status === 200) {
        setSavedJobs((prevSavedJobs) =>
          isSaved
            ? prevSavedJobs.filter((id) => id !== job.id)
            : [...prevSavedJobs, job.id]
        );
      }
    } catch (error) {
      console.error("Error saving job:", error);
      alert("Error saving job, please try again later.");
    }
  };

 

  const applyForJob = (job) => {
 
 
   if (appliedJobs.includes(job.id)) {
     alert("⚠️ You have already applied for this job.");
     return;
   }
   
   setSelectedJob(job);
   setShowApplicationModal(true);  
 
   
 };
 
 useEffect(() => {
   if (showApplicationModal) {
     modalRef.current?.open();
   }
 }, [showApplicationModal]);
 
 const handleApplicationSubmit = async (formData) => {
   const data = new FormData();
 
   if (formData.linkedIn) {
     const linkedInUrl = formData.linkedIn.startsWith("http") 
       ? formData.linkedIn 
       : `https://${formData.linkedIn.trim()}`;
     data.append("linkedIn", linkedInUrl);
   }
 
   // Normalize and append Portfolio URL (optional)
   if (formData.portfolio) {
     const portfolioUrl = formData.portfolio.startsWith("http") 
       ? formData.portfolio 
       : `https://${formData.portfolio.trim()}`;
     data.append("portfolio", portfolioUrl);
   }
 
 
   // Append other form data
   data.append('job_id', selectedJob.id);
   data.append('jobSeeker_id', userId);
   data.append('fullName', formData.fullName);
   data.append('email', formData.email);
   data.append('coverLetter', formData.coverLetter);
   data.append('phone', formData.phone);
   data.append('resume', formData.resume);
  
 
 
   try {
     const response = await axios.post(`${BASE_URL}/jobs/apply_job`, data, {
       headers: {
         'Content-Type': 'multipart/form-data',
       },
     });
 
     alert(response.data.message);
     setAppliedJobs((prevJobs) => [...prevJobs, selectedJob.id]);
     setShowApplicationModal(false);
     modalRef.current?.close();
   } catch (error) {
     alert(error.response?.data?.error || "Error applying for job");
   }
 };
 
 
 useEffect(() => {
   axios
     .get(`${BASE_URL}/jobs/applied_jobs`,
        { params: { jobSeeker_id: userId},
        headers: { 'Authorization': `Bearer ${authToken}` }
       })
     .then((response) => setAppliedJobs(response.data))
     .catch((error) => console.error("Error fetching applied jobs:", error));
 }, [userId,authToken]);
 




 
 

// Filter saved jobs from the sortedJobs list
const savedJobsSet = new Set(savedJobs);
const filteredSavedJobs = JobList.filter((job) => savedJobsSet.has(job.id));


 
  
  return (
    <div className="container mx-auto px-4">
      {/* Job List (Visible when no job is selected) */}
      {!selectedJob && (
        <div className="w-full bg-gray-50 p-4 rounded-lg shadow-md h-[125] overflow-auto">
          <h2 className="text-2xl font-bold text-teal-600 mb-6 text-center">Saved Jobs</h2>

          {/* Job Listings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {isLoading ? (
              <p className="text-center text-md font-medium text-gray-700">Loading...</p>
            ) : error ? (
              <p className="text-red-500 text-center">{error}</p>
            ) : filteredSavedJobs.length > 0 ? (
              filteredSavedJobs.map((job) => (

                   <div
                     key={job.id}
                     className={`p-4 rounded-lg border border-teal-100 shadow-sm cursor-pointer hover:shadow-md transition-all duration-200 ${
                       activeJobId === job.id
                         ? "bg-teal-100 border-l-4 border-teal-500"
                         : "bg-white hover:bg-teal-50"
                     }`}
                     onClick={() => handleJobClick(job)}
                   >
                     {/* 🏢 Company & Job Title */}
                     <div className="flex items-center space-x-3">
                       <img
                         src={job.company_logo || "/default-logo.png"}
                         alt={job.company_name}
                         className="w-16 h-12 rounded-md object-cover border border-teal-100"
                       />
                       <div className="flex-1">
                         <h3 className="text-md font-semibold text-gray-800">{job.job_title}</h3>
                         <p className="text-sm text-gray-600">{job.company_name}</p>
                       </div>
                     </div>
            
                     {/* 🌍 Location & Job Type */}
                     <p className="text-sm text-gray-600 mt-1">
                       📍 {job.location} · {job.employment_type}
                     </p>
            
                     {/* 💰 Salary */}
                     <p className="text-sm font-medium text-gray-700 mt-1">
                       💰 {job.salary_range || "Not specified"}
                     </p>
            
                     {/* 🔹 Action Buttons */}
                     <div className="flex justify-between items-center mt-3">
                       <button className="text-teal-600 font-medium text-sm hover:underline">
                         View details
                       </button>
            
                       {role === "seeker" && (
                         <Button
                           onClick={(e) => {
                             e.stopPropagation();
                             handleSaveJob(job);
                           }}
                           className={`border px-3 py-2 rounded-lg transition-all duration-300 inline-flex items-center justify-center ${
                             savedJobs.includes(job.id)
                               ? "bg-amber-50 text-amber-700 border-amber-600 hover:bg-amber-100 hover:border-amber-700"
                               : "bg-teal-50 text-teal-700 border-teal-600 hover:bg-teal-100 hover:border-teal-700"
                           }`}
                           aria-label={savedJobs.includes(job.id) ? "Unsave job" : "Save job"}
                           disabled={!authToken}
                         >
                           <FaBookmark
                             className={`inline-block mr-2 ${
                               savedJobs.includes(job.id) ? "text-amber-700" : "text-teal-700"
                             }`}
                           />
                           <span className="text-sm font-medium">
                             {savedJobs.includes(job.id) && authToken ? "Saved" : "Save"}
                           </span>
                         </Button>
                       )}
                     </div>
                   </div>
                 ))
               ) : (
              <p className="text-center text-gray-600 col-span-full">No saved jobs available</p>
            )}
          </div>
        </div>
      )}

      {/* Job Details (Visible alone when a job is selected) */}
      {selectedJob && (
        <div className="w-full bg-white p-6 rounded-lg shadow-lg   h-[125vh]  overflow-auto">
         
          <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-lg shadow-sm border border-teal-100 hover:shadow-md transition-shadow duration-200">
          
            <div className="flex items-center space-x-4">
              <img
                src={selectedJob.company_logo || "/default-logo.png"}
                alt={selectedJob.company_name || "Company Logo"}
                className="w-16 h-12 rounded-md object-cover border-2 border-teal-100"
                onError={(e) => (e.target.src = "/default-logo.png")}
              />
              <div>
                <p className="text-3xl font-bold text-teal-700 hover:underline cursor-pointer">
                  {selectedJob.job_title || "Untitled Job"}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedJob.company_name || "Unknown Company"}
                </p>
              </div>
            </div>
          

  <Button
      onClick={() =>  setSelectedJob(null)}
      className="bg-teal-600 text-white px-4 py-2 rounded-md text-sm hover:bg-teal-700 transition-colors duration-200 flex items-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      Back to Saved Jobs
    </Button>



          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-4 hover:underline hover:cursor-pointer">
            {selectedJob.company_name || "Unknown Company"}
          </h2>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-teal-100 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700">
              <div className="flex items-center">
                <span className="mr-2">📍</span>
                <p className="font-semibold">
                  Location: {selectedJob.location || "Not specified"}
                </p>
              </div>
              <div className="flex items-center">
                <span className="mr-2">💼</span>
                <p className="font-semibold">
                  Employment Type: {selectedJob.employment_type || "Not specified"}
                </p>
              </div>
              <div className="flex items-center">
                <span className="mr-2">💰</span>
                <p className="font-semibold">
                  Salary Range: {selectedJob.salary_range || "Not specified"}
                </p>
              </div>
              <div className="flex items-center">
                <span className="mr-2">⏳</span>
                <p className="font-semibold">
                  Application Deadline:{" "}
                  {selectedJob.application_deadline
                    ? new Date(selectedJob.application_deadline).toLocaleDateString()
                    : "Not specified"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-teal-100 mb-6">
            <p className="font-semibold text-lg text-gray-800 mb-2">Job Description</p>
            <p className="text-gray-700">
              {selectedJob.job_description || "No description available"}
            </p>
          </div>

          {/* Add additional sections if available */}
          {selectedJob.key_responsibilities && (
            <div className="bg-white p-4 rounded-lg shadow-sm border border-teal-100 mb-6">
              <p className="font-semibold text-lg text-gray-800 mb-2">Key Responsibilities</p>
              <div className="space-y-2">
                {selectedJob.key_responsibilities.split("\n").map((responsibility, index) => (
                  <div key={index} className="flex items-center">
                    <span className="mr-2">✔️</span>
                    <p className="text-gray-700">{responsibility}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedJob.requirements && (
            <div className="bg-white p-4 rounded-lg shadow-sm border border-teal-100 mb-6">
              <p className="font-semibold text-lg text-gray-800 mb-2">Requirements</p>
              <div className="space-y-2">
                {selectedJob.requirements.split("\n").map((requirement, index) => (
                  <div key={index} className="flex items-center">
                    <span className="mr-2">✅</span>
                    <p className="text-gray-700">{requirement}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedJob.preferred_qualifications && (
            <div className="bg-white p-4 rounded-lg shadow-sm border border-teal-100 mb-6">
              <p className="font-semibold text-lg text-gray-800 mb-2">Preferred Qualifications</p>
              <div className="space-y-2">
                {selectedJob.preferred_qualifications.split("\n").map((qualification, index) => (
                  <div key={index} className="flex items-center">
                    <span className="mr-2">🌟</span>
                    <p className="text-gray-700">{qualification}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedJob.benefits && (
            <div className="bg-white p-4 rounded-lg shadow-sm border border-teal-100 mb-6">
              <p className="font-semibold text-lg text-gray-800 mb-2">Benefits</p>
              <div className="space-y-2">
                {selectedJob.benefits.split("\n").map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <span className="mr-2">💡</span>
                    <p className="text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedJob.how_to_apply && (
            <div className="bg-white p-4 rounded-lg shadow-sm border border-teal-100 mb-6">
              <p className="font-semibold text-lg text-gray-800 mb-2">How to Apply</p>
              <p className="text-gray-700">{selectedJob.how_to_apply}</p>
            </div>
          )}

          {role === "seeker" && (
                     <div className="mt-6 flex justify-center gap-4">
         
                  <Button
                   onClick={(e) => {
                     e.stopPropagation();
                     handleSaveJob(selectedJob);
                   }}
                   className={`px-6 py-2 rounded-lg transition-all duration-300 text-sm font-semibold flex items-center gap-2 ${
                     savedJobs.includes(selectedJob.id)
                       ? "bg-amber-100 text-amber-700 border border-amber-500 hover:bg-amber-200"
                       : "bg-teal-100 text-teal-700 border border-teal-500 hover:bg-teal-200"
                   }`}
                   aria-label={savedJobs.includes(selectedJob.id) ? "Unsave job" : "Save job"}
                   disabled={!authToken}
                 >
                   <FaBookmark
                     className={`inline-block mr-2 ${
                       savedJobs.includes(selectedJob.id) ? "text-amber-700" : "text-teal-700"
                     }`}
                   />
                   <span className="text-sm font-medium">
                     {savedJobs.includes(selectedJob.id) && authToken ? "Saved" : "Save"}
                   </span>
                 </Button>
                 
          
                      <Button
                       onClick={(e) => {
                         e.stopPropagation();
                         applyForJob(selectedJob);
                       }}
                       className={`px-6 py-2 rounded-lg transition-all duration-300 text-sm font-semibold shadow-md ${
                         appliedJobs.includes(selectedJob.id)
                           ? "bg-gradient-to-r from-gray-400 to-gray-500 text-gray-100 cursor-not-allowed"
                           : "bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-700 hover:to-teal-800 hover:shadow-lg"
                       }`}
                       aria-label={appliedJobs.includes(selectedJob.id) ? "Applied" : "Apply"}
                       disabled={appliedJobs.includes(selectedJob.id)}
                     >
                       {appliedJobs.includes(selectedJob.id) ? "Applied" : "Apply Now"}
                     </Button>
                   </div>


          )}

          {showApplicationModal && selectedJob && (
            <ApplicationModal
              ref={modalRef}
              closeErrorDialog={() => {
                setShowApplicationModal(false);
                modalRef.current?.close();
              }}
              onApply={handleApplicationSubmit}
            />
          )}
        </div>
      )}
    </div>
  );
};