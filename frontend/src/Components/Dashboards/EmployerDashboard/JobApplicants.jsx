import PropTypes from "prop-types";
import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import BASE_URL from "../../API";
import debounce from "lodash/debounce";

export const JobApplicants = ({ jobId,onSetActiveContent }) => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewType, setInterviewType] = useState("In-Person");
  const [interviewLocation, setInterviewLocation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [zoomLink, setZoomLink] = useState("");
  const [dressCode, setDressCode] = useState("");
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);
  const authToken = localStorage.getItem("authToken");
  const employerId = localStorage.getItem("employer_id");

  const debouncedStatusUpdateRef = useRef();

  const fetchApplicants = useCallback(async () => {
    if (!authToken || !employerId || !jobId) {
      setError("Please log in and select a job to view applicants.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/jobs/applicants`, {
        params: { Job_id: jobId },
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (Array.isArray(response.data)) {
        setApplicants(response.data);
        setError(null);
      } else {
        throw new Error("Invalid data format from server.");
      }
    } catch (error) {
      setError(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  }, [authToken, employerId, jobId]);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  useEffect(() => {
    debouncedStatusUpdateRef.current = debounce(async (applicantId, newStatus) => {
      setIsStatusUpdating(true);
      try {
        await axios.post(
          `${BASE_URL}/jobs/updateApplicantsStatus`,
          { Job_id: jobId, status: newStatus, applicant_Id: applicantId },
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        setApplicants((prev) =>
          prev.map((app) => (app.ApplicantId === applicantId ? { ...app, status: newStatus } : app))
        );
        if (selectedApplicant?.ApplicantId === applicantId) {
          setSelectedApplicant((prev) => ({ ...prev, status: newStatus }));
        }
        toast.success(`Status updated to ${newStatus}.`, { duration: 2000 });
      } catch (error) {
        toast.error(error.response?.data?.error || "Failed to update status", { duration: 3000 });
      } finally {
        setIsStatusUpdating(false);
      }
    }, 500);
    return () => debouncedStatusUpdateRef.current.cancel();
  }, [authToken, jobId, selectedApplicant]);

  const handleStatusUpdate = useCallback((applicantId, newStatus) => {
    debouncedStatusUpdateRef.current(applicantId, newStatus);
  }, []);

  const handleScheduleInterview = async (applicantId) => {
    if (!interviewDate || !interviewType) {
      toast.error("Date and interview type are required.");
      return;
    }
    if (interviewType === "In-Person" && !interviewLocation.trim()) {
      toast.error("Location is required for in-person interviews.");
      return;
    }
    if (interviewType === "Phone Call" && !phoneNumber.match(/^\+?\d{7,15}$/)) {
      toast.error("Enter a valid phone number (7-15 digits, optional +).");
      return;
    }
    if (interviewType === "Video Call" && !zoomLink.match(/^https?:\/\/.+\..+/)) {
      toast.error("Enter a valid URL for the Zoom link.");
      return;
    }

    const formData = new FormData();
    formData.append("Job_id", jobId);
    formData.append("applicant_Id", applicantId);
    formData.append("interview_date", interviewDate);
    formData.append("interview_type", interviewType);
    formData.append("interview_location", interviewLocation);
    formData.append("phone_number", phoneNumber);
    formData.append("zoom_link", zoomLink);
    formData.append("dress_code", dressCode);
    if (file) {
      console.log("File Selected:", { name: file.name, type: file.type, size: file.size });
      formData.append("file", file);
    } else {
      console.log("No file selected");
    }

    console.log("FormData Contents:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value instanceof File ? value.name : value}`);
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(`${BASE_URL}/jobs/scheduleInterview`, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      const updatedApplicant = {
        ...applicants.find((app) => app.ApplicantId === applicantId),
        status: "Interview",
        interviewScheduled: response.data.interview_date,
        document_url: response.data.document_url,
        interview_id: response.data.interview_id,
      };
      setApplicants((prev) => prev.map((app) => (app.ApplicantId === applicantId ? updatedApplicant : app)));
      if (selectedApplicant?.ApplicantId === applicantId) setSelectedApplicant(updatedApplicant);
      toast.success(`Interview scheduled! ID: ${response.data.interview_id}`, { duration: 3000 });
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Failed to schedule interview";
      toast.error(errorMsg, { duration: 4000 });
      console.error("Schedule Interview Error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setInterviewDate("");
    setInterviewType("In-Person");
    setInterviewLocation("");
    setPhoneNumber("");
    setZoomLink("");
    setDressCode("");
    setFile(null);
  };

  const openInterviewModal = (applicant) => {
    setSelectedApplicant(applicant);
    resetForm();
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && ["application/pdf", "image/jpeg", "image/png"].includes(selectedFile.type)) {
      setFile(selectedFile);
    } else {
      toast.error("Please upload a PDF, JPEG, or PNG file.");
      setFile(null);
    }
  };

  const clearFile = () => {
    setFile(null);
  };

 

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-md animate-pulse">
          <svg className="animate-spin h-6 w-6 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-gray-800 text-lg font-medium">Loading Applicants...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md border border-gray-100">
          <svg className="mx-auto h-10 w-10 text-red-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p className="text-red-600 text-base font-medium mb-4">{error}</p>
          <button
            onClick={fetchApplicants}
            className="bg-teal-600 text-white px-5 py-2 rounded-full hover:bg-teal-700 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-auto bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Job Applicants <span className="text-gray-500 text-xl">({applicants.length})</span>
          </h1>
          <button
            onClick={fetchApplicants}
            className="bg-teal-50 text-teal-700 px-5 py-2 rounded-full hover:bg-teal-100 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
            title="Refresh applicant list"
          >
            Refresh
          </button>
        </header>

        {!selectedApplicant ? (
          <div className="flex flex-col gap-4">
            {applicants.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg shadow-md border border-gray-200">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                <p className="text-gray-600 text-lg font-medium mb-6">No applicants yet for this job.</p>
                <button   onClick={() => onSetActiveContent('JobPosting')}
                   className="inline-block bg-teal-600 text-white px-6 py-3 rounded-full hover:bg-teal-700 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg"
                >
                  Post Another Job
                </button>
              </div>
            ) : (
              applicants.map((applicant) => (
                <div
                  key={applicant.ApplicantId}
                  className="bg-white border border-gray-200 rounded-lg shadow-md p-5 hover:shadow-lg hover:border-teal-400 transition-all duration-300 cursor-pointer flex flex-col group"
                  onClick={() => setSelectedApplicant(applicant)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setSelectedApplicant(applicant)}
                >
                  <div className="flex flex-col gap-3 mb-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center space-x-4">
                        <img
                          src={applicant.ApplicantProfile || "https://via.placeholder.com/48"}
                          alt={`${applicant.full_name}'s profile`}
                          className="h-12 w-12 rounded-full object-cover border-2 border-teal-200 shadow-sm flex-shrink-0"
                        />
                        <div className="flex flex-col">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-teal-600 transition-colors duration-150 truncate">
                            {applicant.full_name || "Unnamed Applicant"}
                          </h3>
                          <p className="text-sm text-gray-600 truncate">{applicant.email || "No email provided"}</p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
                          applicant.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                            : applicant.status === "Accepted"
                            ? "bg-green-100 text-green-800 border border-green-300"
                            : applicant.status === "Interview"
                            ? "bg-purple-100 text-purple-800 border border-purple-300"
                            : applicant.status === "Hired"
                            ? "bg-blue-100 text-blue-800 border border-blue-300"
                            : "bg-red-100 text-red-800 border border-red-300"
                        }`}
                      >
                        {applicant.status === "Accepted" && <span className="mr-1">✅</span>}
                        {applicant.status === "Interview" && <span className="mr-1">⏰</span>}
                        {applicant.status === "Rejected" && <span className="mr-1">❌</span>}
                        {applicant.status || "Pending"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-700 text-sm">
                      <svg className="h-5 w-5 text-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="truncate">Applied: {applicant.appliedDate ? new Date(applicant.appliedDate).toLocaleDateString() : "Unknown"}</span>
                    </div>
                    {applicant.interviewScheduled && (
                      <div className="flex items-center space-x-2 text-gray-700 text-sm">
                        <svg className="h-5 w-5 text-purple-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Interview: {new Date(applicant.interviewScheduled).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap justify-end gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusUpdate(applicant.ApplicantId, "Accepted");
                      }}
                      className={`bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-1.5 rounded-full transition-all duration-200 flex items-center shadow-md hover:shadow-lg text-sm ${
                        applicant.status === "Accepted" || isStatusUpdating ? "opacity-50 cursor-not-allowed" : "hover:from-green-700 hover:to-green-800"
                      }`}
                      disabled={applicant.status === "Accepted" || isStatusUpdating}
                      title="Mark as Accepted"
                    >
                      {isStatusUpdating && applicant.status !== "Accepted" ? (
                        <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : null}
                      Accept
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openInterviewModal(applicant);
                      }}
                      className={`bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-1.5 rounded-full transition-all duration-200 flex items-center shadow-md hover:shadow-lg text-sm ${
                        applicant.status !== "Accepted" || applicant.interviewScheduled ? "opacity-50 cursor-not-allowed" : "hover:from-purple-700 hover:to-purple-800"
                      }`}
                      disabled={applicant.status !== "Accepted" || applicant.interviewScheduled}
                      title="Schedule an Interview"
                    >
                      Schedule
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusUpdate(applicant.ApplicantId, "Pending");
                      }}
                      className={`bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-1.5 rounded-full transition-all duration-200 flex items-center shadow-md hover:shadow-lg text-sm ${
                        applicant.status === "Pending" || isStatusUpdating ? "opacity-50 cursor-not-allowed" : "hover:from-gray-700 hover:to-gray-800"
                      }`}
                      disabled={applicant.status === "Pending" || isStatusUpdating}
                      title="Mark as Pending"
                    >
                      {isStatusUpdating && applicant.status !== "Pending" ? (
                        <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : null}
                      Pending
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusUpdate(applicant.ApplicantId, "Rejected");
                      }}
                      className={`bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-1.5 rounded-full transition-all duration-200 flex items-center shadow-md hover:shadow-lg text-sm ${
                        applicant.status === "Rejected" || isStatusUpdating ? "opacity-50 cursor-not-allowed" : "hover:from-red-700 hover:to-red-800"
                      }`}
                      disabled={applicant.status === "Rejected" || isStatusUpdating}
                      title="Mark as Rejected"
                    >
                      {isStatusUpdating && applicant.status !== "Rejected" ? (
                        <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : null}
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <button
                onClick={() => setSelectedApplicant(null)}
                className="text-teal-600 hover:text-teal-800 font-medium flex items-center space-x-2 transition-all duration-200 text-sm"
                title="Return to applicant list"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"></path>
                </svg>
                <span>Back to Applicants</span>
              </button>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleStatusUpdate(selectedApplicant.ApplicantId, "Accepted")}
                  className={`bg-gradient-to-r from-green-600 to-green-700 text-white px-5 py-2 rounded-full transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg ${
                    selectedApplicant.status === "Accepted" || isStatusUpdating ? "opacity-50 cursor-not-allowed" : "hover:from-green-700 hover:to-green-800"
                  }`}
                  disabled={selectedApplicant.status === "Accepted" || isStatusUpdating}
                  title="Mark as Accepted"
                >
                  {isStatusUpdating && selectedApplicant.status !== "Accepted" ? (
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : null}
                  Accept
                </button>
                <button
                  onClick={() => openInterviewModal(selectedApplicant)}
                  className={`bg-gradient-to-r from-purple-600 to-purple-700 text-white px-5 py-2 rounded-full transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg ${
                    selectedApplicant.status !== "Accepted" || selectedApplicant.interviewScheduled ? "opacity-50 cursor-not-allowed" : "hover:from-purple-700 hover:to-purple-800"
                  }`}
                  disabled={selectedApplicant.status !== "Accepted" || selectedApplicant.interviewScheduled}
                  title="Schedule an Interview"
                >
                  Schedule
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedApplicant.ApplicantId, "Pending")}
                  className={`bg-gradient-to-r from-gray-600 to-gray-700 text-white px-5 py-2 rounded-full transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg ${
                    selectedApplicant.status === "Pending" || isStatusUpdating ? "opacity-50 cursor-not-allowed" : "hover:from-gray-700 hover:to-gray-800"
                  }`}
                  disabled={selectedApplicant.status === "Pending" || isStatusUpdating}
                  title="Mark as Pending"
                >
                  {isStatusUpdating && selectedApplicant.status !== "Pending" ? (
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : null}
                  Pending
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedApplicant.ApplicantId, "Rejected")}
                  className={`bg-gradient-to-r from-red-600 to-red-700 text-white px-5 py-2 rounded-full transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg ${
                    selectedApplicant.status === "Rejected" || isStatusUpdating ? "opacity-50 cursor-not-allowed" : "hover:from-red-700 hover:to-red-800"
                  }`}
                  disabled={selectedApplicant.status === "Rejected" || isStatusUpdating}
                  title="Mark as Rejected"
                >
                  {isStatusUpdating && selectedApplicant.status !== "Rejected" ? (
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : null}
                  Reject
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-100">
              <div className="flex items-center space-x-4">
                <img
                  src={selectedApplicant.ApplicantProfile || "https://via.placeholder.com/48"}
                  alt={`${selectedApplicant.full_name}'s profile`}
                  className="h-16 w-16 rounded-full object-cover border-2 border-teal-200 shadow-sm flex-shrink-0"
                />
                <div className="flex flex-col">
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{selectedApplicant.full_name || "Unnamed Applicant"}</h2>
                  <p className="text-sm text-gray-600">{selectedApplicant.email || "No email provided"}</p>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mt-2 ${
                      selectedApplicant.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                        : selectedApplicant.status === "Accepted"
                        ? "bg-green-100 text-green-800 border border-green-300"
                        : selectedApplicant.status === "Interview"
                        ? "bg-purple-100 text-purple-800 border border-purple-300"
                        : selectedApplicant.status === "Hired"
                        ? "bg-blue-100 text-blue-800 border border-blue-300"
                        : "bg-red-100 text-red-800 border border-red-300"
                    }`}
                  >
                    {selectedApplicant.status === "Accepted" && <span className="mr-1">✅</span>}
                    {selectedApplicant.status === "Interview" && <span className="mr-1">⏰</span>}
                    {selectedApplicant.status === "Rejected" && <span className="mr-1">❌</span>}
                    {selectedApplicant.status || "Pending"}
                  </span>
                  {selectedApplicant.interviewScheduled && (
                    <p className="text-sm text-gray-600 mt-2">Interview: {new Date(selectedApplicant.interviewScheduled).toLocaleString()}</p>
                  )}
                </div>
              </div>
            </div>

            <section className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Applicant Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                <div className="flex items-start">
                  <span className="w-32 font-medium text-gray-900">Full Name:</span>
                  <span className="truncate">{selectedApplicant.full_name || "Not provided"}</span>
                </div>
                <div className="flex items-start">
                  <span className="w-32 font-medium text-gray-900">Email:</span>
                  <span className="truncate">{selectedApplicant.email || "Not provided"}</span>
                </div>
                <div className="flex items-start">
                  <span className="w-32 font-medium text-gray-900">Applied Date:</span>
                  <span>{selectedApplicant.appliedDate ? new Date(selectedApplicant.appliedDate).toLocaleDateString() : "Unknown"}</span>
                </div>
                {selectedApplicant.applicantLinkedIn && (
                  <div className="flex items-start">
                    <span className="w-32 font-medium text-gray-900">LinkedIn:</span>
                    <a href={selectedApplicant.applicantLinkedIn} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-800 underline transition-colors duration-150 truncate">
                      View Profile
                    </a>
                  </div>
                )}
                {selectedApplicant.applicantResume && (
                  <div className="flex items-start">
                    <span className="w-32 font-medium text-gray-900">Resume:</span>
                    <a href={selectedApplicant.applicantResume} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-800 underline transition-colors duration-150 truncate">
                      View Resume
                    </a>
                  </div>
                )}
                {selectedApplicant.ApplicantPortfolio && (
                  <div className="flex items-start">
                    <span className="w-32 font-medium text-gray-900">Portfolio:</span>
                    <a href={selectedApplicant.ApplicantPortfolio} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-800 underline transition-colors duration-150 truncate">
                      View Portfolio
                    </a>
                  </div>
                )}
                {selectedApplicant.document_url && (
                  <div className="flex items-start">
                    <span className="w-32 font-medium text-gray-900">Interview File:</span>
                    <a href={selectedApplicant.document_url} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-800 underline transition-colors duration-150 truncate">
                      View File
                    </a>
                  </div>
                )}
              </div>
              {selectedApplicant.coverLetter && (
                <div className="mt-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-2">Cover Letter</h4>
                  <div className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-md border border-gray-100 whitespace-pre-wrap max-h-60 overflow-auto">
                    {selectedApplicant.coverLetter}
                  </div>
                </div>
              )}
            </section>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" role="dialog" aria-modal="true">
            <div className="bg-white rounded-xl p-8 max-w-lg w-full shadow-2xl transform transition-all duration-300 animate-fade-in">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Schedule Interview for {selectedApplicant?.full_name}</h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700" htmlFor="interview-date">
                    Date and Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="interview-date"
                    type="datetime-local"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className={`mt-1 w-full border rounded-md p-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-150 ${
                      !interviewDate && isSubmitting ? "border-red-500" : "border-gray-300"
                    }`}
                    min={new Date().toISOString().slice(0, 16)}
                    required
                    aria-required="true"
                    aria-describedby={!interviewDate && isSubmitting ? "date-error" : undefined}
                  />
                  {!interviewDate && isSubmitting && (
                    <p id="date-error" className="text-red-500 text-xs mt-1">
                      Date is required
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700" htmlFor="interview-type">
                    Interview Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="interview-type"
                    value={interviewType}
                    onChange={(e) => setInterviewType(e.target.value)}
                    className={`mt-1 w-full border rounded-md p-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-150 ${
                      !interviewType && isSubmitting ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                    aria-required="true"
                    aria-describedby={!interviewType && isSubmitting ? "type-error" : undefined}
                  >
                    <option value="In-Person">In-Person</option>
                    <option value="Phone Call">Phone Call</option>
                    <option value="Video Call">Video Call</option>
                  </select>
                  {!interviewType && isSubmitting && (
                    <p id="type-error" className="text-red-500 text-xs mt-1">
                      Type is required
                    </p>
                  )}
                </div>
                {interviewType === "In-Person" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="interview-location">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="interview-location"
                      type="text"
                      value={interviewLocation}
                      onChange={(e) => setInterviewLocation(e.target.value)}
                      placeholder="e.g., 123 Main St, City"
                      className={`mt-1 w-full border rounded-md p-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-150 ${
                        !interviewLocation.trim() && isSubmitting ? "border-red-500" : "border-gray-300"
                      }`}
                      required={interviewType === "In-Person"}
                      aria-required={interviewType === "In-Person"}
                      aria-describedby={!interviewLocation.trim() && isSubmitting ? "location-error" : undefined}
                    />
                    {!interviewLocation.trim() && isSubmitting && (
                      <p id="location-error" className="text-red-500 text-xs mt-1">
                        Location is required
                      </p>
                    )}
                  </div>
                )}
                {interviewType === "Phone Call" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="phone-number">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="phone-number"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="e.g., +1-123-456-7890"
                      className={`mt-1 w-full border rounded-md p-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-150 ${
                        !phoneNumber.match(/^\+?\d{7,15}$/) && isSubmitting ? "border-red-500" : "border-gray-300"
                      }`}
                      required={interviewType === "Phone Call"}
                      aria-required={interviewType === "Phone Call"}
                      aria-describedby={!phoneNumber.match(/^\+?\d{7,15}$/) && isSubmitting ? "phone-error" : undefined}
                    />
                    {!phoneNumber.match(/^\+?\d{7,15}$/) && isSubmitting && (
                      <p id="phone-error" className="text-red-500 text-xs mt-1">
                        Valid phone number required (7-15 digits)
                      </p>
                    )}
                  </div>
                )}
                {interviewType === "Video Call" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="zoom-link">
                      Zoom Link <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="zoom-link"
                      type="url"
                      value={zoomLink}
                      onChange={(e) => setZoomLink(e.target.value)}
                      placeholder="e.g., https://zoom.us/j/123"
                      className={`mt-1 w-full border rounded-md p-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-150 ${
                        !zoomLink.match(/^https?:\/\/.+\..+/) && isSubmitting ? "border-red-500" : "border-gray-300"
                      }`}
                      required={interviewType === "Video Call"}
                      aria-required={interviewType === "Video Call"}
                      aria-describedby={!zoomLink.match(/^https?:\/\/.+\..+/) && isSubmitting ? "zoom-error" : undefined}
                    />
                    {!zoomLink.match(/^https?:\/\/.+\..+/) && isSubmitting && (
                      <p id="zoom-error" className="text-red-500 text-xs mt-1">
                        Valid URL required
                      </p>
                    )}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700" htmlFor="dress-code">
                    Dress Code (Optional)
                  </label>
                  <input
                    id="dress-code"
                    type="text"
                    value={dressCode}
                    onChange={(e) => setDressCode(e.target.value)}
                    placeholder="e.g., Business Casual"
                    className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-150"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700" htmlFor="file-upload">
                    Upload File (Optional, PDF/JPEG/PNG)
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    name="file"
                    accept=".pdf,image/jpeg,image/png"
                    onChange={handleFileChange}
                    className="mt-1 w-full border border-gray-300 rounded-md p-2 text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 transition-all duration-150"
                  />
                  {file && (
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm text-gray-600">Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)</p>
                      <button
                        onClick={clearFile}
                        className="text-red-600 hover:text-red-800 text-sm font-medium underline transition-colors duration-150"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-200 text-gray-700 px-5 py-2 rounded-md hover:bg-gray-300 transition-all duration-200 text-sm font-medium"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleScheduleInterview(selectedApplicant.ApplicantId)}
                  className="bg-teal-600 text-white px-5 py-2 rounded-md hover:bg-teal-700 transition-all duration-200 text-sm font-medium flex items-center space-x-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  <span>{isSubmitting ? "Scheduling..." : "Schedule"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS for fade-in animation */}
      {/* <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style> */}
    </div>
  );
};

JobApplicants.propTypes = {
  onSetActiveContent:PropTypes.func.isRequired,
  jobId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default JobApplicants;