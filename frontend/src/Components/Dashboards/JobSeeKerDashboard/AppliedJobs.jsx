// import { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import BASE_URL from '../../API';

// export const AppliedJobs = () => {
//   const [appliedJobs, setAppliedJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedJob, setSelectedJob] = useState(null);
//   const [withdrawing, setWithdrawing] = useState(false);
//   const authToken = localStorage.getItem("authToken");
//   const userId = localStorage.getItem("user_Id");

//   const fetchAppliedJobs = useCallback(async () => {
//     if (!authToken || !userId) {
//       setError('Please log in to view your applied jobs.');
//       setLoading(false);
//       return;
//     }
//     try {
//       setLoading(true);
//       const response = await axios.get(`${BASE_URL}/jobs/MyApplication`, {
//         params: { jobSeeker_id: userId },
//         headers: { 'Authorization': `Bearer ${authToken}` }
//       });
//       if (Array.isArray(response.data)) {
//         setAppliedJobs(response.data);
//         setError(null);
//       } else {
//         throw new Error('Invalid data format from server.');
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.details 
//         ? `${error.response.data.error}: ${error.response.data.details}` 
//         : error.response?.data?.error || 'Failed to load applied jobs.';
//       setError(errorMessage);
//       console.error("Fetch error:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, [authToken, userId]);

//   useEffect(() => {
//     fetchAppliedJobs();
//   }, [fetchAppliedJobs]);

//   const handleWithdraw = async (jobId) => {
//     if (!window.confirm('Are you sure you want to withdraw this application?')) return;
//     setWithdrawing(true);
//     try {
//       await axios.post(`${BASE_URL}/jobs/withdraw_application`, 
//         { job_id: jobId, jobSeeker_id: userId },
//         { headers: { 'Authorization': `Bearer ${authToken}` } }
//       );
//       setAppliedJobs(appliedJobs.filter(job => job.id !== jobId));
//       setSelectedJob(null);
//       alert('Application withdrawn successfully.');
//     } catch (error) {
//       alert(error.response?.data?.error || 'Failed to withdraw application.');
//       console.error("Withdraw error:", error);
//     } finally {
//       setWithdrawing(false);
//     }
//   };

//   const sortJobs = (jobs) => {
//     return [...jobs].sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));
//   };

//   if (loading) {
//     return (
//       <div className="h-[125vh] w-full flex items-center justify-center bg-gray-50">
//         <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-md">
//           <svg className="animate-spin h-6 w-6 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//           </svg>
//           <span className="text-gray-800 text-lg font-medium">Loading Your Applications...</span>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="h-[125vh] w-full flex items-center justify-center bg-gray-50">
//         <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md border border-gray-100">
//           <svg className="mx-auto h-10 w-10 text-red-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//           </svg>
//           <p className="text-red-600 text-base font-medium mb-4">{error}</p>
//           <button
//             onClick={fetchAppliedJobs}
//             className="bg-teal-600 text-white px-5 py-2 rounded-full hover:bg-teal-700 transition-all duration-200 text-sm font-medium"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const sortedJobs = sortJobs(appliedJobs);

//   return (
//     <div className="h-[125vh] w-full overflow-auto bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="w-full mx-auto">
//         <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
//           <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
//             My Applied Jobs <span className="text-gray-500 text-lg">({appliedJobs.length})</span>
//           </h1>
//           <button
//             onClick={fetchAppliedJobs}
//             className="bg-teal-50 text-teal-700 px-4 py-1.5 rounded-full hover:bg-teal-100 transition-all duration-200 text-sm font-medium"
//           >
//             Refresh
//           </button>
//         </header>

//         {!selectedJob ? (
//           <div className="flex flex-col gap-4">
//             {appliedJobs.length === 0 ? (
//               <div className="text-center py-12 bg-white rounded-lg shadow-md border border-gray-200">
//                 <svg className="mx-auto h-10 w-10 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
//                 </svg>
//                 <p className="text-gray-600 text-base font-medium mb-4">You haven’t applied to any jobs yet.</p>
//                 <a
//                   href="/jobs"
//                   className="inline-block bg-teal-600 text-white px-5 py-2 rounded-full hover:bg-teal-700 transition-all duration-200 text-sm font-medium"
//                 >
//                   Explore Job Opportunities
//                 </a>
//               </div>
//             ) : (
//               sortedJobs.map((job) => (
//                 <div
//                   key={job.id}
//                   className="w-full bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg shadow-md p-4 hover:shadow-lg hover:border-teal-400 transition-all duration-300 cursor-pointer flex flex-col"
//                   onClick={() => setSelectedJob(job)}
//                 >
//                   <div className="flex flex-col gap-2 mb-3">
//                     <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
//                       <div className="flex items-center space-x-3">
//                         {job.companyLogo && (
//                           <img
//                             src={job.companyLogo}
//                             alt="Company Logo"
//                             className="w-10 h-10 rounded-full object-cover border-2 border-teal-200 shadow-sm flex-shrink-0"
//                           />
//                         )}
//                         <div className="flex flex-col">
//                           <h3 className="text-lg font-semibold text-gray-900 hover:text-teal-600 transition-colors duration-150">{job.title || 'Untitled'}</h3>
//                           <p className="text-sm text-gray-600">{job.companyName || 'Unknown Company'} • {job.location || 'Unknown Location'}</p>
//                         </div>
//                       </div>
//                       <span
//                         className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
//                           job.applicationStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' :
//                           job.applicationStatus === 'Accepted' ? 'bg-green-100 text-green-800 border border-green-300' :
//                           'bg-red-100 text-red-800 border border-red-300'
//                         }`}
//                       >
//                         {job.applicationStatus || 'Unknown'}
//                       </span>
//                     </div>
//                     <div className="flex flex-col gap-1 text-gray-700 text-sm">
//                       <div className="flex items-center space-x-2">
//                         <svg className="h-5 w-5 text-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                         </svg>
//                         <span className="truncate">Applied: {job.appliedDate ? new Date(job.appliedDate).toLocaleDateString() : 'Unknown'}</span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex flex-col sm:flex-row justify-end gap-3">
//                     <button
//                       onClick={(e) => { e.stopPropagation(); handleWithdraw(job.id); }}
//                       className={`bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-1.5 rounded-full hover:from-red-700 hover:to-red-800 transition-all duration-200 flex items-center shadow-md hover:shadow-lg text-sm ${withdrawing ? 'opacity-50 cursor-not-allowed' : ''}`}
//                       disabled={withdrawing}
//                     >
//                       <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                       </svg>
//                       {withdrawing ? 'Withdrawing...' : 'Withdraw'}
//                     </button>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         ) : (
//           <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
//               <button
//                 onClick={() => setSelectedJob(null)}
//                 className="text-teal-600 hover:text-teal-800 font-medium flex items-center space-x-2 transition-all duration-200 text-sm"
//               >
//                 <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"></path>
//                 </svg>
//                 <span>Back to Applied Jobs</span>
//               </button>
//               <button
//                 onClick={() => handleWithdraw(selectedJob.id)}
//                 className={`bg-gradient-to-r from-red-600 to-red-700 text-white px-5 py-2 rounded-full hover:from-red-700 hover:to-red-800 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg ${withdrawing ? 'opacity-50 cursor-not-allowed' : ''}`}
//                 disabled={withdrawing}
//               >
//                 {withdrawing ? 'Withdrawing...' : 'Withdraw Application'}
//               </button>
//             </div>

//             <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-100">
//               <div className="flex items-center space-x-4">
//                 {selectedJob.companyLogo && (
//                   <img src={selectedJob.companyLogo} alt="Company Logo" className="h-12 w-12 rounded-full object-cover border-2 border-teal-200 shadow-sm" />
//                 )}
//                 <div className="flex flex-col">
//                   <h2 className="text-xl font-bold text-gray-900 tracking-tight">{selectedJob.title || 'Untitled'}</h2>
//                   <p className="text-sm text-gray-600">{selectedJob.companyName || 'Unknown Company'} • {selectedJob.location || 'Unknown Location'}</p>
//                   <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mt-2 ${
//                     selectedJob.applicationStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' :
//                     selectedJob.applicationStatus === 'Accepted' ? 'bg-green-100 text-green-800 border border-green-300' :
//                     'bg-red-100 text-red-800 border border-red-300'
//                   }`}>
//                     {selectedJob.applicationStatus || 'Unknown'}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-6">
//               <section className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Details</h3>
//                 <div className="flex flex-col gap-2 text-sm text-gray-700">
//                   <div className="flex items-start">
//                     <span className="w-32 font-medium text-gray-900">Company:</span>
//                     <span>{selectedJob.companyName || 'Unknown'}</span>
//                   </div>
//                   <div className="flex items-start">
//                     <span className="w-32 font-medium text-gray-900">Location:</span>
//                     <span>{selectedJob.location || 'Unknown'}</span>
//                   </div>
//                   <div className="flex items-start">
//                     <span className="w-32 font-medium text-gray-900">Employment Type:</span>
//                     <span>{selectedJob.employmentType || 'Not specified'}</span>
//                   </div>
//                   {selectedJob.salaryRange && (
//                     <div className="flex items-start">
//                       <span className="w-32 font-medium text-gray-900">Salary Range:</span>
//                       <span>{selectedJob.salaryRange}</span>
//                     </div>
//                   )}
//                   <div className="flex items-start">
//                     <span className="w-32 font-medium text-gray-900">Posted Date:</span>
//                     <span>{selectedJob.postedDate ? new Date(selectedJob.postedDate).toLocaleDateString() : 'Unknown'}</span>
//                   </div>
//                   <div className="flex items-start">
//                     <span className="w-32 font-medium text-gray-900">Applied Date:</span>
//                     <span>{selectedJob.appliedDate ? new Date(selectedJob.appliedDate).toLocaleDateString() : 'Unknown'}</span>
//                   </div>
//                 </div>
//                 <div className="mt-4">
//                   <h4 className="text-md font-semibold text-gray-900 mb-2">Job Description</h4>
//                   <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-md border border-gray-100">{selectedJob.description || 'No description available'}</p>
//                 </div>
//               </section>

//               <section className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Application</h3>
//                 <div className="flex flex-col gap-2 text-sm text-gray-700">
//                   <div className="flex items-start">
//                     <span className="w-32 font-medium text-gray-900">Full Name:</span>
//                     <span>{selectedJob.applicantName || 'Not provided'}</span>
//                   </div>
//                   <div className="flex items-start">
//                     <span className="w-32 font-medium text-gray-900">Email:</span>
//                     <span>{selectedJob.applicantEmail || 'Not provided'}</span>
//                   </div>
//                   {selectedJob.applicantLinkedIn && (
//                     <div className="flex items-start">
//                       <span className="w-32 font-medium text-gray-900">LinkedIn:</span>
//                       <a href={selectedJob.applicantLinkedIn} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-800 underline transition-colors duration-150">
//                         View LinkedIn Profile
//                       </a>
//                     </div>
//                   )}
//                   {selectedJob.applicantResume && (
//                     <div className="flex items-start">
//                       <span className="w-32 font-medium text-gray-900">Resume:</span>
//                       <a href={selectedJob.applicantResume} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-800 underline transition-colors duration-150">
//                         View Resume
//                       </a>
//                     </div>
//                   )}
//                   {selectedJob.ApplicantPortfolio && (
//                     <div className="flex items-start">
//                       <span className="w-32 font-medium text-gray-900">Portfolio:</span>
//                       <a href={selectedJob.ApplicantPortfolio} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-800 underline transition-colors duration-150">
//                         View Portfolio
//                       </a>
//                     </div>
//                   )}
//                 </div>
//                 {selectedJob.coverLetter && (
//                   <div className="mt-4">
//                     <h4 className="text-md font-semibold text-gray-900 mb-2">Cover Letter</h4>
//                     <div className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-md border border-gray-100 whitespace-pre-wrap">{selectedJob.coverLetter}</div>
//                   </div>
//                 )}
//               </section>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };


import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast'; // Added for notifications
import BASE_URL from '../../API';

export const AppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [withdrawing, setWithdrawing] = useState(false);
  const authToken = localStorage.getItem("authToken");
  const userId = localStorage.getItem("user_Id");
  const getDriveImageUrl = (url) => {

    if (!url || !url.includes("drive.google.com")) return null;
  
    // Extract file ID from different Google Drive URL formats
    const fileId = url.match(/(?:\/d\/|id=)([a-zA-Z0-9_-]+)/)?.[1];
    if (!fileId) return null;
  
    // Use Google's thumbnail proxy (works in <img> tags)
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
  };
 
  


  const fetchAppliedJobs = useCallback(async () => {
    if (!authToken || !userId) {
      setError('Please log in to view your applied jobs.');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/jobs/MyApplication`, {
        params: { jobSeeker_id: userId },
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (Array.isArray(response.data)) {
        setAppliedJobs(response.data);
        setError(null);
        // Check for new interviews and notify
        response.data.forEach(job => {
          if (job.interviewDate && job.interviewStatus === 'Scheduled') {
            toast.success(`Interview scheduled for ${job.title} on ${new Date(job.interviewDate).toLocaleString()}!`, {
              duration: 5000,
              position: 'top-right',
            });
          }
        });
      } else {
        throw new Error('Invalid data format from server.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.details 
        ? `${error.response.data.error}: ${error.response.data.details}` 
        : error.response?.data?.error || 'Failed to load applied jobs.';
      setError(errorMessage);
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [authToken, userId]);

  useEffect(() => {
    fetchAppliedJobs();
  }, [fetchAppliedJobs]);

  const handleWithdraw = async (jobId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;
    setWithdrawing(true);
    try {
      await axios.post(`${BASE_URL}/jobs/withdraw_application`, 
        { job_id: jobId, jobSeeker_id: userId },
        { headers: { 'Authorization': `Bearer ${authToken}` } }
      );
      setAppliedJobs(appliedJobs.filter(job => job.id !== jobId));
      setSelectedJob(null);
      toast.success('Application withdrawn successfully.', { duration: 3000, position: 'top-right' });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to withdraw application.', { duration: 3000, position: 'top-right' });
      console.error("Withdraw error:", error);
    } finally {
      setWithdrawing(false);
    }
  };

  const sortJobs = (jobs) => {
    return [...jobs].sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-md animate-pulse">
          <svg className="animate-spin h-6 w-6 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-gray-800 text-lg font-medium">Loading Your Applications...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md border border-gray-100">
          <svg className="mx-auto h-10 w-10 text-red-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p className="text-red-600 text-base font-medium mb-4">{error}</p>
          <button
            onClick={fetchAppliedJobs}
            className="bg-teal-600 text-white px-5 py-2 rounded-full hover:bg-teal-700 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const sortedJobs = sortJobs(appliedJobs);

  return (
    <div className="min-h-screen w-full overflow-auto bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <Toaster /> {/* Added for toast notifications */}
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            My Applied Jobs <span className="text-gray-500 text-lg">({appliedJobs.length})</span>
          </h1>
          <button
            onClick={fetchAppliedJobs}
            className="bg-teal-50 text-teal-700 px-4 py-1.5 rounded-full hover:bg-teal-100 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg"
          >
            Refresh
          </button>
        </header>

        {!selectedJob ? (
          <div className="flex flex-col gap-4 ">
            {appliedJobs.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-md border border-gray-200">
                <svg className="mx-auto h-10 w-10 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <p className="text-gray-600 text-base font-medium mb-4">You haven’t applied to any jobs yet.</p>
                <a
                  href="/jobs"
                  className="inline-block bg-teal-600 text-white px-5 py-2 rounded-full hover:bg-teal-700 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg"
                >
                  Explore Job Opportunities
                </a>
              </div>
            ) : (
              sortedJobs.map((job) => (
                <div
                  key={job.id}
                  className="w-full bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg shadow-md p-4 hover:shadow-lg hover:border-teal-400 transition-all duration-300 cursor-pointer flex flex-col"
                  onClick={() => setSelectedJob(job)}
                >
                  <div className="flex flex-col gap-2 mb-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-3">
                        {job.companyLogo && (
                          // <img
                          //   src={job.companyLogo}
                          //   alt="Company Logo"
                          //   className="w-10 h-10 rounded-full object-cover border-2 border-teal-200 shadow-sm flex-shrink-0"
                          // />

                          <img
                          src={getDriveImageUrl(job.companyLogo) || "/default-profile.jpg"}
                          alt="company_logo"
                          className="w-10 h-10 rounded-full object-cover border-2 border-teal-200 shadow-sm flex-shrink-0"
                          onError={(e) => (e.target.src = "/default-profile.jpg")}  
                          />

                        )}
                        <div className="flex flex-col">
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-teal-600 transition-colors duration-150">{job.title || 'Untitled'}</h3>
                          <p className="text-sm text-gray-600">{job.companyName || 'Unknown Company'} • {job.location || 'Unknown Location'}</p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
                          job.applicationStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' :
                          job.applicationStatus === 'Accepted' ? 'bg-green-100 text-green-800 border border-green-300' :
                          job.applicationStatus === 'Hired' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                          'bg-red-100 text-red-800 border border-red-300'
                        }`}
                      >
                        {job.applicationStatus || 'Unknown'}
                        {job.interviewDate && job.interviewStatus === 'Scheduled' && (
                          <span className="ml-2 text-xs text-purple-600">(Interview Scheduled)</span>
                        )}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 text-gray-700 text-sm">
                      <div className="flex items-center space-x-2">
                        <svg className="h-5 w-5 text-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="truncate">Applied: {job.appliedDate ? new Date(job.appliedDate).toLocaleDateString() : 'Unknown'}</span>
                      </div>
                      {job.interviewDate && job.interviewStatus === 'Scheduled' && (
                        <div className="flex items-center space-x-2">
                          <svg className="h-5 w-5 text-purple-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Interview: {new Date(job.interviewDate).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end gap-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleWithdraw(job.id); }}
                      className={`bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-1.5 rounded-full hover:from-red-700 hover:to-red-800 transition-all duration-200 flex items-center shadow-md hover:shadow-lg text-sm ${withdrawing ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={withdrawing}
                    >
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      {withdrawing ? 'Withdrawing...' : 'Withdraw'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
              <button
                onClick={() => setSelectedJob(null)}
                className="text-teal-600 hover:text-teal-800 font-medium flex items-center space-x-2 transition-all duration-200 text-sm"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"></path>
                </svg>
                <span>Back to Applied Jobs</span>
              </button>
              <button
                onClick={() => handleWithdraw(selectedJob.id)}
                className={`bg-gradient-to-r from-red-600 to-red-700 text-white px-5 py-2 rounded-full hover:from-red-700 hover:to-red-800 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg ${withdrawing ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={withdrawing}
              >
                {withdrawing ? 'Withdrawing...' : 'Withdraw Application'}
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-100">
              <div className="flex items-center space-x-4">
                {selectedJob.companyLogo && (



                  // <img src={selectedJob.companyLogo} 
                  // alt="Company Logo" 
                  // className="h-12 w-12 rounded-full object-cover border-2 border-teal-200 shadow-sm" 
                  // />
                
                  <img
                  src={getDriveImageUrl(selectedJob.companyLogo) || "/default-profile.jpg"}
                  alt="company_logo"
                  className="h-12 w-12 rounded-full object-cover border-2 border-teal-200 shadow-sm"
                  onError={(e) => (e.target.src = "/default-profile.jpg")}  
                  />
               )}
                <div className="flex flex-col">
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight">{selectedJob.title || 'Untitled'}</h2>
                  <p className="text-sm text-gray-600">{selectedJob.companyName || 'Unknown Company'} • {selectedJob.location || 'Unknown Location'}</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mt-2 ${
                    selectedJob.applicationStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' :
                    selectedJob.applicationStatus === 'Accepted' ? 'bg-green-100 text-green-800 border border-green-300' :
                    selectedJob.applicationStatus === 'Hired' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                    'bg-red-100 text-red-800 border border-red-300'
                  }`}>
                    {selectedJob.applicationStatus || 'Unknown'}
                    {selectedJob.interviewDate && selectedJob.interviewStatus === 'Scheduled' && (
                      <span className="ml-2 text-xs text-purple-600">(Interview Scheduled)</span>
                    )}
                  </span>
                  {selectedJob.interviewDate && selectedJob.interviewStatus === 'Scheduled' && (
                    <p className="text-sm text-gray-600 mt-2">Interview: {new Date(selectedJob.interviewDate).toLocaleString()}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <section className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Details</h3>
                <div className="flex flex-col gap-2 text-sm text-gray-700">
                  <div className="flex items-start">
                    <span className="w-32 font-medium text-gray-900">Company:</span>
                    <span>{selectedJob.companyName || 'Unknown'}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-32 font-medium text-gray-900">Location:</span>
                    <span>{selectedJob.location || 'Unknown'}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-32 font-medium text-gray-900">Employment Type:</span>
                    <span>{selectedJob.employmentType || 'Not specified'}</span>
                  </div>
                  {selectedJob.salaryRange && (
                    <div className="flex items-start">
                      <span className="w-32 font-medium text-gray-900">Salary Range:</span>
                      <span>{selectedJob.salaryRange}</span>
                    </div>
                  )}
                  <div className="flex items-start">
                    <span className="w-32 font-medium text-gray-900">Posted Date:</span>
                    <span>{selectedJob.postedDate ? new Date(selectedJob.postedDate).toLocaleDateString() : 'Unknown'}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-32 font-medium text-gray-900">Applied Date:</span>
                    <span>{selectedJob.appliedDate ? new Date(selectedJob.appliedDate).toLocaleDateString() : 'Unknown'}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="text-md font-semibold text-gray-900 mb-2">Job Description</h4>
                  <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-md border border-gray-100">{selectedJob.description || 'No description available'}</p>
                </div>
              </section>

              <section className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Application</h3>
                <div className="flex flex-col gap-2 text-sm text-gray-700">
                  <div className="flex items-start">
                    <span className="w-32 font-medium text-gray-900">Full Name:</span>
                    <span>{selectedJob.applicantName || 'Not provided'}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-32 font-medium text-gray-900">Email:</span>
                    <span>{selectedJob.applicantEmail || 'Not provided'}</span>
                  </div>
                  {selectedJob.applicantLinkedIn && (
                    <div className="flex items-start">
                      <span className="w-32 font-medium text-gray-900">LinkedIn:</span>
                      <a href={selectedJob.applicantLinkedIn} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-800 underline transition-colors duration-150">
                        View LinkedIn Profile
                      </a>
                    </div>
                  )}
                  {selectedJob.applicantResume && (
                    <div className="flex items-start">
                      <span className="w-32 font-medium text-gray-900">Resume:</span>
                      <a href={selectedJob.applicantResume} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-800 underline transition-colors duration-150">
                        View Resume
                      </a>
                    </div>
                  )}
                  {selectedJob.ApplicantPortfolio && (
                    <div className="flex items-start">
                      <span className="w-32 font-medium text-gray-900">Portfolio:</span>
                      <a href={selectedJob.ApplicantPortfolio} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-800 underline transition-colors duration-150">
                        View Portfolio
                      </a>
                    </div>
                  )}
                </div>
                {selectedJob.coverLetter && (
                  <div className="mt-4">
                    <h4 className="text-md font-semibold text-gray-900 mb-2">Cover Letter</h4>
                    <div className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-md border border-gray-100 whitespace-pre-wrap">{selectedJob.coverLetter}</div>
                  </div>
                )}
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};