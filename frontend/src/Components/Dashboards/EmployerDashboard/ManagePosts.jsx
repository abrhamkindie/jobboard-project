import PropTypes from 'prop-types';
import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { EditPost } from "./EditPosts";
import { JobApplicants } from "./JobApplicants";
import BASE_URL from "../../API";
import Button from '../Button';

export const ManagePosts = ({ onSetActiveContent }) => {
  const [jobList, setJobList] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [viewingApplicantsJobId, setViewingApplicantsJobId] = useState(null);
  const [activeJobId, setActiveJobId] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [sortBy, setSortBy] = useState("date");
  const [filterStatus, setFilterStatus] = useState("all");

  const navigate = useNavigate();
  const employerId = localStorage.getItem("employer_id");
  const authToken = localStorage.getItem("authToken");


  const getDriveImageUrl = (url) => {

    if (!url || !url.includes("drive.google.com")) return null;
  
    // Extract file ID from different Google Drive URL formats
    const fileId = url.match(/(?:\/d\/|id=)([a-zA-Z0-9_-]+)/)?.[1];
    if (!fileId) return null;
  
    // Use Google's thumbnail proxy (works in <img> tags)
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
  };
 
  const calculateDaysLeft = (deadline) => {
    if (!deadline) return { days: null, displayText: "No deadline set" };
    const currentDate = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate - currentDate;
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return { 
      days: daysLeft,
      displayText: daysLeft < 0 ? "Expired" : `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`
    };
  };

  useEffect(() => {
    if (!authToken || !employerId) {
      alert("Please log in as an employer to manage posts.");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/jobs/employer_jobs`, {
          params: { employer_id: employerId },
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
        setJobList(response.data.map(job => ({
          ...job,
          status: job.status || (job.application_deadline && new Date(job.application_deadline) < new Date() ? "closed" : "active")
        })));
      } catch (error) {
        console.error("Error fetching employer's jobs:", error);
        alert("Failed to load jobs. Please try again.");
      }
    };

    fetchJobs();
  }, [employerId, navigate, authToken]);

  const filteredAndSortedJobs = useMemo(() => {
    let filteredJobs = [...jobList];
    if (filterStatus !== "all") {
      filteredJobs = filteredJobs.filter(job => job.status === filterStatus);
    }
    filteredJobs.sort((a, b) => {
      if (sortBy === "title") return a.job_title.localeCompare(b.job_title);
      if (sortBy === "location") return a.location.localeCompare(b.location);
      if (sortBy === "date") return new Date(b.created_at || b.posted_date) - new Date(a.created_at || a.posted_date);
      return 0;
    });
    return filteredJobs;
  }, [jobList, sortBy, filterStatus]);

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setActiveJobId(job.id);
    setViewingApplicantsJobId(null);
  };

  const handleEditClick = (job) => {
     setEditingPostId(job.id);
  };

  const handleDelete = async (job) => {
    if (!window.confirm(`Are you sure you want to delete "${job.job_title}"?`)) return;
    try {
      await axios.delete(`${BASE_URL}/jobs/delete/${job.id}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      alert('✅ Job deleted successfully');
      setJobList(jobList.filter(j => j.id !== job.id));
      if (selectedJob?.id === job.id) setSelectedJob(null);
      if (viewingApplicantsJobId === job.id) setViewingApplicantsJobId(null);
      onSetActiveContent();
    } catch (error) {
      console.error('Error deleting job:', error);
      alert("❌ Failed to delete job. Try again.");
    }
  };

  const handleToggleStatus = async (job) => {
    const newStatus = job.status === "active" ? "closed" : "active";
    try {
      await axios.put(`${BASE_URL}/jobs/update/${job.id}`, 
        { status: newStatus },
        { headers: { 'Authorization': `Bearer ${authToken}` } }
      );
      setJobList(jobList.map(j => 
        j.id === job.id ? { ...j, status: newStatus } : j
      ));
      if (selectedJob?.id === job.id) {
        setSelectedJob({ ...selectedJob, status: newStatus });
      }
      alert(`✅ Job ${newStatus === "active" ? "opened" : "closed"} successfully`);
    } catch (error) {
      console.error('Error toggling job status:', error);
      alert("❌ Failed to update job status. Try again.");
    }
  };

  const handleViewApplicants = (job) => {
 
    setViewingApplicantsJobId(job.id);
    setSelectedJob(null);
  };

  return (
    <>
      {editingPostId ? (
        <EditPost jobId={editingPostId} onSetActiveContent={() => setEditingPostId(null)} />
      ) : (
        <div className="h-[125vh] w-full overflow-auto bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
          {viewingApplicantsJobId ? (
            <div className="w-full max-w-7xl mx-auto">
              <Button
                onClick={() => setViewingApplicantsJobId(null)}
                className="mb-4 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-200 flex items-center shadow-md"
              >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Job Listings
              </Button>
              <JobApplicants jobId={viewingApplicantsJobId} />
            </div>
          ) : selectedJob ? (
            // Original Job Details View (unchanged)
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 border border-gray-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
                <div className="flex items-center space-x-5 mb-4 sm:mb-0">
                  {/* <img
                    src={selectedJob.company_logo || "/default-logo.png"}
                    alt={selectedJob.company_name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-teal-200 shadow-sm"
                  /> */}

              <img
                src={getDriveImageUrl(selectedJob.company_logo) || "/default-profile.jpg"}
                alt="companyLogo"
                className="w-16 h-16 rounded-full object-cover border-2 border-teal-200 shadow-sm"
                onError={(e) => (e.target.src = "/default-profile.jpg")}  
                />
  

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{selectedJob.job_title}</h2>
                    <p className="text-lg text-gray-600">{selectedJob.company_name}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => handleEditClick(selectedJob)}
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-all duration-200 flex items-center shadow-sm"
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(selectedJob)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-200 flex items-center shadow-sm"
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </Button>
                  <Button
                    onClick={() => handleToggleStatus(selectedJob)}
                    className={`${selectedJob.status === "active" ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700"} text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center shadow-sm`}
                  >
                    {selectedJob.status === "active" ? (
                      <>
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Close
                      </>
                    ) : (
                      <>
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Open
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => handleViewApplicants(selectedJob)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center shadow-sm"
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    View Applicants
                  </Button>
                  <Button
                    onClick={() => setSelectedJob(null)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-200 flex items-center shadow-sm"
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 kla24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back
                  </Button>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                  <p><span className="font-semibold text-gray-900">Location:</span> {selectedJob.location}</p>
                  <p><span className="font-semibold text-gray-900">Type:</span> {selectedJob.employment_type}</p>
                  <p><span className="font-semibold text-gray-900">Salary:</span> {selectedJob.salary_range || "Not specified"}</p>
                   <p><span className="font-semibold text-gray-900">Posted Date:</span> {selectedJob.created_at ? new Date(selectedJob.created_at).toLocaleDateString() : "Not specified"}</p>
                  <p><span className="font-semibold text-gray-900">Deadline:</span> {selectedJob.application_deadline ? new Date(selectedJob.application_deadline).toLocaleDateString() : "Not specified"}</p>
                  <p><span className="font-semibold text-gray-900">Days Left:</span> {calculateDaysLeft(selectedJob.application_deadline).displayText}</p>
                  <p><span className="font-semibold text-gray-900">Status:</span> <span className={selectedJob.status === "active" ? "text-green-600 font-medium" : "text-red-600 font-medium"}>{selectedJob.status}</span></p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Job Description</h3>
                  <p className="text-gray-600 leading-relaxed">{selectedJob.job_description || "No description available"}</p>
                </div>

                {selectedJob.key_responsibilities && (
                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Key Responsibilities</h3>
                    <ul className="space-y-2 text-gray-600">
                      {selectedJob.key_responsibilities.split("\n").map((responsibility, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-teal-500 mr-2">•</span>
                          <span>{responsibility}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedJob.requirements && (
                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Requirements</h3>
                    <ul className="space-y-2 text-gray-600">
                      {selectedJob.requirements.split("\n").map((requirement, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-teal-500 mr-2">•</span>
                          <span>{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedJob.preferred_qualifications && (
                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Preferred Qualifications</h3>
                    <ul className="space-y-2 text-gray-600">
                      {selectedJob.preferred_qualifications.split("\n").map((qualification, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-teal-500 mr-2">•</span>
                          <span>{qualification}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedJob.benefits && (
                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Benefits</h3>
                    <ul className="space-y-2 text-gray-600">
                      {selectedJob.benefits.split("\n").map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-teal-500 mr-2">•</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedJob.how_to_apply && (
                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">How to Apply</h3>
                    <p className="text-gray-600 leading-relaxed">{selectedJob.how_to_apply}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="w-full mx-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Your Job Postings</h2>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full sm:w-36 border border-gray-300 rounded-lg px-3 py-1.5 bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
                  >
                    <option value="date">Date Posted</option>
                    <option value="title">Job Title</option>
                    <option value="location">Location</option>
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full sm:w-36 border border-gray-300 rounded-lg px-3 py-1.5 bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
                  >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              {filteredAndSortedJobs.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {filteredAndSortedJobs.map((job) => (
                    <div
                      key={job.id}
                      className={`w-full bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg shadow-md p-4 hover:shadow-lg hover:border-teal-400 transition-all duration-300 cursor-pointer flex flex-col ${
                        activeJobId === job.id ? "border-teal-500 border-2" : ""
                      }`}
                      onClick={() => handleJobClick(job)}
                    >
                      <div className="flex flex-col gap-2 mb-3">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                          <div className="flex items-center space-x-3">
                            {/* <img
                              src={job.company_logo || "/default-logo.png"}
                              alt={job.company_name}
                              className="w-10 h-10 rounded-full object-cover border-2 border-teal-200 shadow-sm flex-shrink-0"
                            /> */}



              <img
                src={getDriveImageUrl(job.company_logo) || "/default-profile.jpg"}
                alt="company_logo"
                className="w-16 h-16 rounded-full object-cover border-2 border-teal-200 shadow-sm"
                onError={(e) => (e.target.src = "/default-profile.jpg")}  
                />

                            <div className="flex flex-col">
                              <h3 className="text-lg font-semibold text-gray-900 tracking-tight">{job.job_title}</h3>
                              <p className="text-sm text-gray-600">{job.company_name}</p>
                            </div>
                          </div>
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
                              job.status === "active" ? "bg-green-100 text-green-800 border border-green-300" : "bg-red-100 text-red-800 border border-red-300"
                            }`}
                          >
                            {job.status === "active" ? (
                              <>
                                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Active {job.application_deadline && `(${calculateDaysLeft(job.application_deadline).displayText})`}
                              </>
                            ) : (
                              <>
                                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Closed
                              </>
                            )}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1 text-gray-700 text-sm">
                          <div className="flex items-center space-x-2">
                            <svg className="h-5 w-5 text-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="truncate">{job.location}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <svg className="h-5 w-5 text-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="truncate">{job.employment_type}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <svg className="h-5 w-5 text-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="truncate">{job.salary_range || "Not specified"}</span>
                          </div>

 
                          <div className="flex items-center space-x-2">
                          <svg  className="h-5 w-5 text-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"/>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 2v4M15 2v4M3 9h18" />
                          </svg>
                          <span className="truncate">{job.created_at ? new Date(job.created_at).toLocaleDateString() : "Not specified"}</span>
                        </div>



                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-end gap-3">
                        <Button
                          onClick={(e) => { e.stopPropagation(); handleEditClick(job); }}
                          className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-4 py-1.5 rounded-full hover:from-teal-700 hover:to-teal-800 transition-all duration-200 flex items-center shadow-md hover:shadow-lg text-sm"
                        >
                          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          Edit
                        </Button>
                        <Button
                          onClick={(e) => { e.stopPropagation(); handleToggleStatus(job); }}
                          className={`${job.status === "active" ? "bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800" : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"} text-white px-4 py-1.5 rounded-full transition-all duration-200 flex items-center shadow-md hover:shadow-lg text-sm`}
                        >
                          {job.status === "active" ? "Close" : "Open"}
                        </Button>
                        <Button
                          onClick={(e) => { e.stopPropagation(); handleViewApplicants(job); }}
                          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-1.5 rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center shadow-md hover:shadow-lg text-sm"
                        >
                          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Applicants
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-md border border-gray-200">
                  <svg className="mx-auto h-10 w-10 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-base text-gray-600 mb-4">No job postings available</p>
                  <Button
                    onClick={() => navigate("/create-job")}
                    className="bg-teal-600 text-white px-5 py-2 rounded-lg hover:bg-teal-700 transition-all duration-200 shadow-md text-sm"
                  >
                    Post a New Job
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

ManagePosts.propTypes = {
  onSetActiveContent: PropTypes.func.isRequired
};

export default ManagePosts;