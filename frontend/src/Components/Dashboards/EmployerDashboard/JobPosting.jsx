import PropTypes from 'prop-types';
import { useState } from 'react';
import axios from 'axios';
import BASE_URL from '../../API';
import Button from '../Button'; 

  export const   JobPosting =({onSetActiveContent})=>{
    const CompanyName=localStorage.getItem('name');
    const [formData, setFormData] = useState({
      Job_title: "",
      Company_name:CompanyName,
      Location: "",
      Employment_type: "Full-time",
      Salary_range: "",
      job_description: "",
      Key_responsibilities: "",
      Requirements: "",
      Preferred_qualifications: "",
      Benefits: "",
      Application_deadline: "",
      How_to_apply: "",
    });
  
    const [loading, setLoading] = useState(false);
  
    // ✅ Handle Input Changes
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    // ✅ Form Submission
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
  
      try {

        const employer_id = localStorage.getItem("employer_id");  
        const authToken = localStorage.getItem("authToken");

        if (!authToken) {
          alert("❌ No authentication token found. Please log in again.");
          return;
        }
        
        if (!employer_id) {
          alert("❌ Employer ID not found. Please log in again.");
          return;
        }
    
        const jobData = { ...formData, employer_id };   
        
        const res = await axios.post(`${BASE_URL}/jobs/job_posts`, jobData, {
          headers: {
             "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,

          },
        });
  
        alert("✅ " + res.data.message);
        setFormData({
          Job_title: "",
          Company_name:CompanyName,
          Location: "",
          Employment_type: "Full-time",
          Salary_range: "",
          job_description: "",
          Key_responsibilities: "",
          Requirements: "",
          Preferred_qualifications: "",
          Benefits: "",
          Application_deadline: "",
          How_to_apply: "",
        });
      } catch (err) {
        console.error("❌ Error:", err);
        alert("❌ " + (err.response?.data?.error || "An unknown error occurred."));
      } finally {
        setLoading(false);
      }
    };
  
  
  return (
    <div className="flex-1 overflow-y-auto   h-[125vh]  overflow-auto">

  <div className="group relative flex justify-end items-end mx-10 my-4">
    <Button
      onClick={() => onSetActiveContent("EmpSummary")}
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
      Back
    </Button>
  </div>  
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-xl   ">
      <h2 className="text-3xl font-bold text-center text-teal-600">Job Posting Form</h2>
      <form onSubmit={handleSubmit} className="mt-6 space-y-6  ">
        {/* Job Details Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-teal-100">
          <h3 className="text-xl font-semibold text-teal-600 mb-4">Job Details</h3>
          <div className="space-y-4">
            {/* Job Title */}
            <div>
              <label className="block text-gray-700 font-medium">Job Title</label>
              <input
                type="text"
                name="Job_title"
                value={formData.Job_title}
                onChange={handleChange}
                required
                placeholder="Enter job title"
                className="w-full p-3 mt-2 border border-teal-100 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
  
            {/* Location */}
            <div>
              <label className="block text-gray-700 font-medium">Location</label>
              <input
                type="text"
                name="Location"
                value={formData.Location}
                onChange={handleChange}
                required
                placeholder="Enter job location"
                className="w-full p-3 mt-2 border border-teal-100 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
  
            {/* Employment Type */}
            <div>
              <label className="block text-gray-700 font-medium">Employment Type</label>
              <select
                name="Employment_type"
                value={formData.Employment_type}
                onChange={handleChange}
                className="w-full p-3 mt-2 border border-teal-100 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>
  
            {/* Salary Range */}
            <div>
              <label className="block text-gray-700 font-medium">Salary Range</label>
              <input
                type="text"
                name="Salary_range"
                value={formData.Salary_range}
                onChange={handleChange}
                placeholder="Enter salary range (e.g., $50,000 - $70,000)"
                className="w-full p-3 mt-2 border border-teal-100 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
  
            {/* Application Deadline */}
            <div>
              <label className="block text-gray-700 font-medium">Application Deadline</label>
              <input
                type="date"
                name="Application_deadline"
                value={formData.Application_deadline}
                onChange={handleChange}
                required
                className="w-full p-3 mt-2 border border-teal-100 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>
  
        {/* Job Description Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-teal-100">
          <h3 className="text-xl font-semibold text-teal-600 mb-4">Job Description</h3>
          <div>
             <textarea
              name="job_description"
              value={formData.job_description}
              onChange={handleChange}
              required
              placeholder="Describe the job role and responsibilities"
              className="w-full p-3 mt-2 border border-teal-100 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              rows={5}
            />
          </div>
        </div>
  
        {/* Key Responsibilities Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-teal-100">
          <h3 className="text-xl font-semibold text-teal-600 mb-4">Key Responsibilities</h3>
          <div>
             <textarea
              name="Key_responsibilities"
              value={formData.Key_responsibilities}
              onChange={handleChange}
              required
              placeholder="Enter one responsibility per line"
              className="w-full p-3 mt-2 border border-teal-100 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              rows={5}
            />
          </div>
        </div>
  
        {/* Requirements Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-teal-100">
          <h3 className="text-xl font-semibold text-teal-600 mb-4">Requirements</h3>
          <div>
             <textarea
              name="Requirements"
              value={formData.Requirements}
              onChange={handleChange}
              required
              placeholder="Enter one requirement per line"
              className="w-full p-3 mt-2 border border-teal-100 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              rows={5}
            />
          </div>
        </div>
  
        {/* Preferred Qualifications Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-teal-100">
          <h3 className="text-xl font-semibold text-teal-600 mb-4">Preferred Qualifications</h3>
          <div>
             <textarea
              name="Preferred_qualifications"
              value={formData.Preferred_qualifications}
              onChange={handleChange}
              placeholder="Enter one qualification per line"
              className="w-full p-3 mt-2 border border-teal-100 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              rows={5}
            />
          </div>
        </div>
  
        {/* Benefits Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-teal-100">
          <h3 className="text-xl font-semibold text-teal-600 mb-4">Benefits</h3>
          <div>
             <textarea
              name="Benefits"
              value={formData.Benefits}
              onChange={handleChange}
              placeholder="Enter one benefit per line"
              className="w-full p-3 mt-2 border border-teal-100 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              rows={5}
            />
          </div>
        </div>
  
        {/* How to Apply Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-teal-100">
          <h3 className="text-xl font-semibold text-teal-600 mb-4">How to Apply</h3>
          <div>
             <textarea
              name="How_to_apply"
              value={formData.How_to_apply}
              onChange={handleChange}
              required
              placeholder="Provide instructions on how to apply"
              className="w-full p-3 mt-2 border border-teal-100 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              rows={5}
            />
          </div>
        </div>
  
        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 mt-4 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          {loading ? "Posting..." : "Post a Job"}
        </button>
      </form>
    </div>
  </div>
  )
}
JobPosting.propTypes={
  onSetActiveContent:PropTypes.func.isRequired
}
