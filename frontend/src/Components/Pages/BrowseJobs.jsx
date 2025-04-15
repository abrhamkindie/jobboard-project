import axios from "axios";
import { useState, useEffect, useRef } from "react";
import BASE_URL from "../API";
import ApplicationModal from '../Modals/ApplicationModal';
import Button from "../Button";
import { useNavigate } from "react-router-dom"; 
import { FaBookmark, FaDollarSign ,FaCalendarCheck } from "react-icons/fa";
import { MapPin } from "lucide-react"; 
import JobCard from '../Cards/JobCard';
import Modal from '../Modal';
 
export const BrowseJobs = () => {
  const [JobList, setJobList] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [activeJobId, setActiveJobId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    employmentType: "",
    salaryRange: "",
  });
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [savedJobs, setSavedJobs] = useState([]);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const jobsPerPage = 12;
  const navigate = useNavigate();
  const modal = useRef();
  const modalRef = useRef();  
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("user_Id");
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const savedFilters = JSON.parse(localStorage.getItem('searchFilters'));
    if (savedFilters) {
      const { searchTerm, location, jobType } = savedFilters;
      setSearchTerm(searchTerm);
      setFilters((prevFilters) => ({
        ...prevFilters,
        location,
        employmentType: jobType,
      }));
    }
  }, []);

  useEffect(() => {
    return () => {
      localStorage.removeItem('searchFilters');
    };
  }, []);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/jobs/job_lists`, {
        params: {
          page: currentPage,
          limit: jobsPerPage,
          search: searchTerm,
          location: filters.location,
          employmentType: filters.employmentType,
          salaryRange: filters.salaryRange,
          sortBy: sortBy,
        },
      })
      .then((response) => {
        if (Array.isArray(response.data) && response.data.length === 2) {
          setJobList(response.data[0]);  
          setTotalPages(response.data[1]?.totalPages || 1);
        } else {
          console.error("Unexpected API response format:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
      });
  }, [currentPage, searchTerm, filters, sortBy]);

  useEffect(() => {
    const job = localStorage.getItem("clickedJob");
    if (job) {
      try {
        const parsedJob = JSON.parse(job);  
        setSelectedJob(parsedJob);
        setActiveJobId(parsedJob.id);
      } catch (error) {
        console.error("Error parsing job from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      localStorage.removeItem('clickedJob');
    };
  }, []);

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setActiveJobId(job.id);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    localStorage.setItem('searchFilters', JSON.stringify({
      searchTerm: value,
      location: filters.location,
      employmentType: filters.employmentType,
    }));
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, [name]: value };
      localStorage.setItem('searchFilters', JSON.stringify({
        searchTerm: searchTerm,
        location: updatedFilters.location,
        employmentType: updatedFilters.employmentType,
      }));
      return updatedFilters;
    });
  };

  const handleSortChange = (e) => setSortBy(e.target.value);
  
  useEffect(() => {
    if (userId && authToken) {
      axios
        .get(`${BASE_URL}/save/saved_jobs`, {
          params: { user_id: userId },
          headers: { 'Authorization': `Bearer ${authToken}` }
        })
        .then((response) => setSavedJobs(response.data.map((job) => job.job_id)))
        .catch((error) => console.error("Error fetching saved jobs:", error));
    }
  }, [userId, authToken]);

  const handleSaveJob = async (job) => {    
    if (!authToken) {
      modal.current?.open();
      setTimeout(() => navigate("/login"), 2000);
      return 0;
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
    if (!authToken) {
      modal.current?.open();
      setTimeout(() => navigate("/login"), 2000);
      return 0;
    }

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

    if (formData.portfolio) {
      const portfolioUrl = formData.portfolio.startsWith("http") 
        ? formData.portfolio 
        : `https://${formData.portfolio.trim()}`;
      data.append("portfolio", portfolioUrl);
    }

    data.append('job_id', selectedJob.id);
    data.append('jobSeeker_id', userId);
    data.append('fullName', formData.fullName);
    data.append('email', formData.email);
    data.append('coverLetter', formData.coverLetter);
    data.append('phone', formData.phone);
    data.append('resume', formData.resume);

    console.log("resume",formData.resume);
    console.log("authToken",authToken);

 
    try {
      const response = await axios.post(`${BASE_URL}/jobs/apply_job`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${authToken}`

        },
      });

      alert("✅" + response.data.message);
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
        { 
          params: { jobSeeker_id: userId },
          headers: { 'Authorization': `Bearer ${authToken}` }
        })
      .then((response) => setAppliedJobs(response.data))
      .catch((error) => console.error("Error fetching applied jobs:", error));
  }, [userId, authToken]);

  const filteredJobs = JobList.filter((job) => {
    return (
      job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filters.location === "" || job.location === filters.location) &&
      (filters.employmentType === "" || job.employment_type === filters.employmentType) &&
      (filters.salaryRange === "" || job.salary_range === filters.salaryRange)
    );
  });

  const sortedJobsByDate = [...filteredJobs].sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at);
  });

  localStorage.setItem("sortedJobsByDate", sortedJobsByDate);

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.created_at) - new Date(a.created_at);
    } else if (sortBy === "salary") {
      return b.salary_range - a.salary_range;
    } else if (sortBy === "title") {
      return a.job_title.localeCompare(b.job_title);
    }
    return 0;
  });

  const calculateDaysLeft = (deadline) => {
    const currentDate = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate - currentDate;
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) {
      return { status: "Expired", days: 0 };
    }
    return { 
      status: "Open", 
      days: daysLeft,
      displayText: `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`
    };
  };

  const formatPostingDate = (createdAt, deadline) => {
    if (!deadline) {
      const currentDate = new Date();
      const postedDate = new Date(createdAt);
      const diffTime = Math.abs(currentDate - postedDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    }
    
    const { status, displayText } = calculateDaysLeft(deadline);
    return status === "Expired" ? "Expired" : displayText;
  };

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const filterClass = `${selectedJob ? 'w-full' : 'w-full sm:w-auto'} p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500`;

  return (
    <>
      <Modal ref={modal}>
        <div className="p-4 sm:p-6">
          <span className="block text-xl sm:text-2xl font-semibold text-center text-gray-800">
            Access <span className="text-red-600 font-bold">Restricted</span>
          </span>
          <span className="block text-base sm:text-lg text-center text-gray-600 mt-4">
            <span className="font-semibold">Please log in</span> to continue and explore job opportunities.
            <span className="underline text-teal-600"> Sign up here</span> to get started!
          </span>
        </div>
      </Modal>

      <div className="min-h-screen container mx-auto px-2 sm:px-4 md:px-6 py-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className={`${selectedJob ? 'w-full lg:w-1/3' : 'w-full'} bg-gray-50 p-4 rounded-lg shadow-md overflow-auto max-h-screen`}>
            {/* 🔍 Search and Filters (Top Section) */}
            <div className="bg-white shadow-md rounded-lg p-4 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-teal-600 mb-4">Find Your Next Job</h2>
              <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full p-2 border border-teal-100 rounded-md focus:ring-2 focus:ring-teal-500"
                />
                <select
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  className={`${filterClass.replace('border-gray-300', 'border-teal-100')} w-full sm:w-auto`}
                >
                  <option value="">All Locations</option>
                  <option value="New York">New York</option>
                  <option value="San Francisco">San Francisco</option>
                  <option value="Remote">Remote</option>
                </select>
                <select
                  name="employmentType"
                  value={filters.employmentType}
                  onChange={handleFilterChange}
                  className={`${filterClass.replace('border-gray-300', 'border-teal-100')} w-full sm:w-auto`}
                >
                  <option value="">All Employment Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                </select>
                <select
                  name="salaryRange"
                  value={filters.salaryRange}
                  onChange={handleFilterChange}
                  className={`${filterClass.replace('border-gray-300', 'border-teal-100')} w-full sm:w-auto`}
                >
                  <option value="">All Salary Ranges</option>
                  <option value="$50,000 - $70,000">$50,000 - $70,000</option>
                  <option value="$70,000 - $90,000">$70,000 - $90,000</option>
                  <option value="$90,000+">$90,000+</option>
                </select>
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className={`${filterClass.replace('border-gray-300', 'border-teal-100')} w-full sm:w-auto`}
                >
                  <option value="">Sort By</option>
                  <option value="date">Date Posted</option>
                  <option value="salary">Salary</option>
                  <option value="title">Job Title</option>
                </select>
              </div>
            </div>

            {/* 📋 Job Listings */}
            <div className={`${!selectedJob ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-4'}`}>
              {sortedJobs.length > 0 ? (
                sortedJobs.map((job) => (
                  selectedJob ? (
                    // If job is selected
                    <div
                      key={job.id}
                      onClick={() => handleJobClick(job)}
                      className={`border rounded-xl p-4 shadow-sm bg-white hover:border-teal-600 hover:cursor-pointer transition-all duration-300 ${
                        activeJobId === job.id
                          ? "bg-teal-100 border-l-8 border-teal-500"
                          : "bg-white hover:bg-teal-50"
                      }`}
                    >
                      {/* Featured Badge and Posting Date */}
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-600 flex gap-1">
                          <FaCalendarCheck size={12} className="text-teal-600" />
                          {formatPostingDate(job.created_at)}
                        </span>
                        <span className="bg-teal-600 text-white text-xs px-1.5 py-0.5 rounded-md shadow-sm">Featured</span>
                      </div>

                      {/* Job Title and Company Info */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex justify-center">
                          <img
                            src={job.company_logo || "/default-logo.png"}
                            alt={job.company_name}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-teal-100 cursor-pointer"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-teal-700 text-sm font-semibold">
                            {job.job_title} <span className="text-gray-500">({job.employment_type})</span>
                          </h3>
                          <p className="text-xs text-gray-600">{job.company_name}</p>
                        </div>
                      </div>

                      {/* Location, Salary, and Employment Type */}
                      <div className="text-gray-700 text-xs mb-2 space-y-1">
                        <p className="flex items-center gap-1">
                          <MapPin size={12} className="text-teal-600" /> {job.location}
                        </p>
                        <p className="flex items-center gap-1">
                          <FaDollarSign size={12} className="text-teal-600" /> {job.salary_range}
                        </p>
                      </div>

                      {/* View Details and Save Button */}
                      <div className="flex justify-between items-center mt-2">
                        <a
                          href={`/job/${job.id}`}
                          className="text-teal-600 text-sm font-medium hover:text-teal-800 cursor-pointer hover:underline"
                        >
                          View Details
                        </a>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSaveJob(job);
                          }}
                          className={`border px-2 py-1 sm:px-3 sm:py-2 rounded-lg transition-all duration-300 inline-flex items-center justify-center ${
                            savedJobs.includes(job.id)
                              ? "bg-amber-50 text-amber-700 border-amber-600 hover:bg-amber-100 hover:border-amber-700"
                              : "bg-teal-50 text-teal-700 border-teal-600 hover:bg-teal-100 hover:border-teal-700"
                          }`}
                          aria-label={savedJobs.includes(job.id) ? "Unsave job" : "Save job"}
                        >
                          <FaBookmark
                            className={`inline-block mr-1 sm:mr-2 ${
                              savedJobs.includes(job.id) ? "text-amber-700" : "text-teal-700"
                            }`}
                          />
                          <span className="text-xs sm:text-sm font-medium">
                            {savedJobs.includes(job.id) && authToken ? "Saved" : "Save"}
                          </span>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // If job is not selected
                    <JobCard
                      key={job.id}
                      job={job}
                      handleJobClick={handleJobClick}
                      activeJobId={activeJobId}
                      savedJobs={savedJobs}
                      appliedJobs={appliedJobs}
                      role={role}
                      authToken={authToken}
                      tags={[job.employment_type, job.location]}
                      handleSaveJob={handleSaveJob}
                      applyForJob={applyForJob}
                      formatPostingDate={formatPostingDate}
                    />
                  )
                ))
              ) : (
                <p className="text-gray-600 text-center col-span-full">No jobs found.</p>
              )}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-6 flex-wrap gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`mx-1 px-3 py-1 rounded-md text-sm ${
                  currentPage === 1 ? "bg-gray-200 cursor-not-allowed" : "bg-teal-100 hover:bg-teal-200"
                }`}
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`mx-1 px-3 py-1 rounded-md text-sm ${
                    currentPage === i + 1 ? "bg-teal-600 text-white" : "bg-teal-100 hover:bg-teal-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`mx-1 px-3 py-1 rounded-md text-sm ${
                  currentPage === totalPages ? "bg-gray-200 cursor-not-allowed" : "bg-teal-100 hover:bg-teal-200"
                }`}
              >
                Next
              </button>
            </div>
          </div>

          <div className={`${selectedJob ? 'w-full lg:w-2/3 lg:ml-4 bg-white p-4 sm:p-6 rounded-lg shadow-lg overflow-auto max-h-screen' : 'hidden'}`}>
            {/* 📜 Job Details (Only when a job is clicked) */}
            {selectedJob && (
              <>
                {/* Company Logo and Name */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 p-4 bg-white rounded-lg shadow-sm border border-teal-100">
                  <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                    <div className="flex-shrink-0">
                      <img
                        src={selectedJob.company_logo || "/default-logo.png"}
                        alt={selectedJob.company_name}
                        className="w-12 h-12 sm:w-16 sm:h-12 rounded-lg object-cover border-2 border-teal-100 hover:border-teal-500 transition-all duration-300 shadow-sm"
                      />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-teal-700 hover:text-teal-800 hover:underline transition-all duration-300">
                        {selectedJob.job_title}
                      </h2>
                      <p className="text-base sm:text-lg text-gray-600 mt-1">
                        at <span className="font-semibold text-gray-800 italic">{selectedJob.company_name}</span>
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() => setSelectedJob(null)}
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
                    Back to Browse Jobs
                  </Button>
                </div>

                {/* Job Details */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-teal-100 mb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700 text-sm sm:text-base">
                    <div className="flex items-center">
                      <span className="mr-2">📍</span>
                      <p className="font-semibold">Location: {selectedJob.location}</p>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">💼</span>
                      <p className="font-semibold">Employment Type: {selectedJob.employment_type}</p>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">💰</span>
                      <p className="font-semibold">Salary Range: {selectedJob.salary_range || "Not specified"}</p>
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
                    <div className="flex items-center">
                      <span className="mr-2">⏳</span>
                      <p className="font-semibold">
                        Application Status:{" "}
                        <span className={
                          calculateDaysLeft(selectedJob.application_deadline).status === "Expired"
                            ? "text-red-600"
                            : "text-teal-600"
                        }>
                          {calculateDaysLeft(selectedJob.application_deadline).status}
                        </span>
                        {selectedJob.application_deadline && (
                          calculateDaysLeft(selectedJob.application_deadline).status !== "Expired" ? (
                            ` (${calculateDaysLeft(selectedJob.application_deadline).displayText})`
                          ) : ""
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Job Description */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-teal-100 mb-6">
                  <p className="font-semibold text-lg text-gray-800 mb-2">Job Description</p>
                  <p className="text-gray-700 text-sm sm:text-base">{selectedJob.job_description}</p>
                </div>

                {/* Key Responsibilities */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-teal-100 mb-6">
                  <p className="font-semibold text-lg text-gray-800 mb-2">Key Responsibilities</p>
                  <div className="space-y-2">
                    {selectedJob.key_responsibilities?.split("\n").map((responsibility, index) => (
                      <div key={index} className="flex items-center">
                        <span className="mr-2">✔️</span>
                        <p className="text-gray-700 text-sm sm:text-base">{responsibility}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Requirements */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-teal-100 mb-6">
                  <p className="font-semibold text-lg text-gray-800 mb-2">Requirements</p>
                  <div className="space-y-2">
                    {selectedJob.requirements?.split("\n").map((requirement, index) => (
                      <div key={index} className="flex items-center">
                        <span className="mr-2">✅</span>
                        <p className="text-gray-700 text-sm sm:text-base">{requirement}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preferred Qualifications */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-teal-100 mb-6">
                  <p className="font-semibold text-lg text-gray-800 mb-2">Preferred Qualifications</p>
                  <div className="space-y-2">
                    {selectedJob.preferred_qualifications?.split("\n").map((qualification, index) => (
                      <div key={index} className="flex items-center">
                        <span className="mr-2">🌟</span>
                        <p className="text-gray-700 text-sm sm:text-base">{qualification}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-teal-100 mb-6">
                  <p className="font-semibold text-lg text-gray-800 mb-2">Benefits</p>
                  <div className="space-y-2">
                    {selectedJob.benefits?.split("\n").map((benefit, index) => (
                      <div key={index} className="flex items-center">
                        <span className="mr-2">💡</span>
                        <p className="text-gray-700 text-sm sm:text-base">{benefit}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* How to Apply */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-teal-100 mb-6">
                  <p className="font-semibold text-lg text-gray-800 mb-2">How to Apply</p>
                  <p className="text-gray-700 text-sm sm:text-base">{selectedJob.how_to_apply}</p>
                </div>

                {/* Apply Button (for Job Seekers) */}
                {role === "seeker" && (
                  <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveJob(selectedJob);
                      }}
                      className={`px-4 py-2 rounded-lg transition-all duration-300 text-sm font-semibold flex items-center gap-2 justify-center ${
                        savedJobs.includes(selectedJob.id)
                          ? "bg-amber-100 text-amber-700 border border-amber-500 hover:bg-amber-200"
                          : "bg-teal-100 text-teal-700 border border-teal-500 hover:bg-teal-200"
                      }`}
                      aria-label={savedJobs.includes(selectedJob.id) ? "Unsave job" : "Save job"}
                      disabled={!authToken}
                    >
                      <FaBookmark
                        className={`inline-block ${
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
                      className={`px-4 py-2 rounded-lg transition-all duration-300 text-sm font-semibold shadow-md w-full sm:w-auto ${
                        appliedJobs.includes(selectedJob.id) || 
                        calculateDaysLeft(selectedJob.application_deadline).status === "Expired"
                          ? "bg-gradient-to-r from-gray-400 to-gray-500 text-gray-100 cursor-not-allowed"
                          : "bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-700 hover:to-teal-800 hover:shadow-lg"
                      }`}
                      aria-label={appliedJobs.includes(selectedJob.id) ? "Applied" : "Apply"}
                      disabled={
                        appliedJobs.includes(selectedJob.id) || 
                        calculateDaysLeft(selectedJob.application_deadline).status === "Expired"
                      }
                    >
                      {appliedJobs.includes(selectedJob.id) 
                        ? "Applied" 
                        : calculateDaysLeft(selectedJob.application_deadline).status === "Expired" 
                          ? "Closed" 
                          : "Apply Now"}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Application Modal */}
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
    </>
  );
};