import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import BASE_URL from '../../API';
import axios from 'axios';
import Button from '../Button';

export const EditPost = ({ onSetActiveContent, jobId }) => {
  const authToken=localStorage.getItem("authToken");

   const [formData, setFormData] = useState({
    Job_title: "",
    Location: "",
    Employment_type: "Full-time",
    Salary_range: "",
    Job_description: "",
    Key_responsibilities: "",
    Requirements: "",
    Preferred_qualifications: "",
    Benefits: "",
    Application_deadline: "",
    How_to_apply: "",
    employer_id: "", 
  });

  const [loading, setLoading] = useState(false);

  // Fetch job data if jobId exists
  useEffect(() => {
    if (jobId) {
 
      const fetchJobData = async () => {
        setLoading(true);

        
        try {

          const res = await axios.get(`${BASE_URL}/jobs/job_posts/${jobId}`); 
           if (typeof res.data === 'string' || res.data instanceof String) {
            console.error("❌ Received unexpected HTML data", res.data);
            return;
          }
 
          const fetchedJobData = res.data;
           setFormData({
            Job_title: fetchedJobData.job_title || "",
            Location: fetchedJobData.location || "",
            Employment_type: fetchedJobData.employment_type || "Full-time",
            Salary_range: fetchedJobData.salary_range || "",
            Job_description: fetchedJobData.job_description || "",
            Key_responsibilities: fetchedJobData.key_responsibilities || "",
            Requirements: fetchedJobData.requirements || "",
            Preferred_qualifications: fetchedJobData.preferred_qualifications || "",
            Benefits: fetchedJobData.benefits || "",
            Application_deadline: fetchedJobData.application_deadline 
            ? new Date(fetchedJobData.application_deadline).toISOString().split("T")[0]
            : "",
             How_to_apply: fetchedJobData.how_to_apply || "",
            employer_id: fetchedJobData.employer_id || localStorage.getItem("employer_id") || "",
          });
        } catch (error) {
          console.error("Error fetching job data:", error);
          alert("❌ Could not fetch job data for editing.");
        } finally {
          setLoading(false);
        }
      };

      fetchJobData();
    } else {
       setFormData({
        Job_title: "",
        Location: "",
        Employment_type: "Full-time",
        Salary_range: "",
        Job_description: "",
        Key_responsibilities: "",
        Requirements: "",
        Preferred_qualifications: "",
        Benefits: "",
        Application_deadline: "",
        How_to_apply: "",
        employer_id: localStorage.getItem("employer_id") || "",
      });
    }
  }, [jobId]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleUpdate = async (e) => {
    
    e.preventDefault();
    setLoading(true);

    try {
      const employer_id = localStorage.getItem("employer_id");
      if (!employer_id) {
        alert("❌ Employer ID not found. Please log in again.");
        return;
      }

      const jobPayload = { ...formData, employer_id };

        const res= await axios.post(`${BASE_URL}/jobs/edit_post/${jobId}`, jobPayload, {
        headers: { "Content-Type": "application/json" ,
          Authorization: `Bearer ${authToken}`,


        },
 
      });

      alert("✅ " + res.data.message);
       onSetActiveContent();  
     } catch (err) {
      console.error("❌ Error:", err);
      alert("❌ " + (err.response?.data?.error || "An unknown error occurred."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
  <div className="group relative flex justify-end items-end mx-10 my-4">
    <Button
      onClick={onSetActiveContent}
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
      Back to List
    </Button>
  </div>

  <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-xl  h-[120vh]  overflow-auto">
    <h2 className="text-3xl font-bold text-center text-teal-800">
      Edit Job Post
    </h2>
    <form onSubmit={handleUpdate} className="mt-6">
      {/* Job Title */}
      <div className="mb-6">
        <label className="block text-teal-700 font-medium">Job Title</label>
        <input
          type="text"
          name="Job_title"
          value={formData.Job_title}
          onChange={handleChange}
          required
          className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        />
      </div>
      {/* Location */}
      <div className="mb-6">
        <label className="block text-teal-700 font-medium">Location</label>
        <input
          type="text"
          name="Location"
          value={formData.Location}
          onChange={handleChange}
          required
          className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        />
      </div>

      {/* Employment Type */}
      <div className="mb-6">
        <label className="block text-teal-700 font-medium">Employment Type</label>
        <select
          name="Employment_type"
          value={formData.Employment_type}
          onChange={handleChange}
          className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        >
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Freelance">Freelance</option>
        </select>
      </div>

      {/* Salary Range */}
      <div className="mb-6">
        <label className="block text-teal-700 font-medium">Salary Range</label>
        <input
          type="text"
          name="Salary_range"
          value={formData.Salary_range}
          onChange={handleChange}
          required
          className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        />
      </div>

      {/* Job Description */}
      <div className="mb-6">
        <label className="block text-teal-700 font-medium">Job Description</label>
        <textarea
          name="Job_description"
          value={formData.Job_description}
          onChange={handleChange}
          required
          rows="4"
          className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        />
      </div>

      {/* Key Responsibilities */}
      <div className="mb-6">
        <label className="block text-teal-700 font-medium">Key Responsibilities</label>
        <textarea
          name="Key_responsibilities"
          value={formData.Key_responsibilities}
          onChange={handleChange}
          required
          rows="4"
          className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        />
      </div>

      {/* Requirements */}
      <div className="mb-6">
        <label className="block text-teal-700 font-medium">Requirements</label>
        <textarea
          name="Requirements"
          value={formData.Requirements}
          onChange={handleChange}
          required
          rows="4"
          className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        />
      </div>

      {/* Preferred Qualifications */}
      <div className="mb-6">
        <label className="block text-teal-700 font-medium">Preferred Qualifications</label>
        <textarea
          name="Preferred_qualifications"
          value={formData.Preferred_qualifications}
          onChange={handleChange}
          rows="4"
          className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        />
      </div>

      {/* Benefits */}
      <div className="mb-6">
        <label className="block text-teal-700 font-medium">Benefits</label>
        <textarea
          name="Benefits"
          value={formData.Benefits}
          onChange={handleChange}
          rows="4"
          className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        />
      </div>

      {/* Application Deadline */}
      <div className="mb-6">
        <label className="block text-teal-700 font-medium">Application Deadline</label>
        <input
          type="date"
          name="Application_deadline"
          value={formData.Application_deadline}
          onChange={handleChange}
          required
          className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        />
      </div>

      {/* How to Apply */}
      <div className="mb-6">
        <label className="block text-teal-700 font-medium">How to Apply</label>
        <textarea
          name="How_to_apply"
          value={formData.How_to_apply}
          onChange={handleChange}
          rows="4"
          className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full p-3 mt-4 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-colors duration-200"
      >
        {loading ? "Saving..." : "Update Job"}
      </button>
    </form>
  </div>
</div>
  );
};

EditPost.propTypes = {
  onSetActiveContent: PropTypes.func.isRequired,
  jobId: PropTypes.number.isRequired,  // jobId should be a string
};
