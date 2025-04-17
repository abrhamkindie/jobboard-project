import Button from "./Button.jsx";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal.jsx";
import { FaBookmark, FaDollarSign, FaBriefcase, FaCalendarCheck, FaStar } from "react-icons/fa";
import { MapPin, Clock, Users, CheckCircle } from "lucide-react";
import { useRef, useState } from "react";



const getDriveImageUrl = (url) => {

  if (!url || !url.includes("drive.google.com")) return null;

  // Extract file ID from different Google Drive URL formats
  const fileId = url.match(/(?:\/d\/|id=)([a-zA-Z0-9_-]+)/)?.[1];
  if (!fileId) return null;

  // Use Google's thumbnail proxy (works in <img> tags)
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
};

function JobListing({
  jobTitle,
  companyName,
  companyLogo,
  location,
  salary,
  jobType,
  postingDate,
  tags,
  companyRating,
  className = "",
  iconClassName = "",
}) {
  const authToken = localStorage.getItem("authToken");
  const [isAuthenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();
  const modal = useRef();

  const applyForJob = (e) => {
    e.stopPropagation();
    if (!authToken) {
      setAuthenticated(true);
      modal.current?.open();
      setTimeout(() => {
        setAuthenticated(false);
        navigate("/login");
      }, 2000);
      return 0;
    }
  };

  const saveJob = (e) => {
    e.stopPropagation();
    if (!authToken) {
      setAuthenticated(true);
      modal.current?.open();
      setTimeout(() => {
        setAuthenticated(false);
        navigate("/login");
      }, 2000);
      return 0;
    }
  };

  // Format posting date (e.g., "Posted 2 days ago")
  const formatPostingDate = (date) => {
    const currentDate = new Date();
    const postedDate = new Date(date);
    const diffTime = Math.abs(currentDate - postedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} day${diffDays > 1 ? "s" : ""} left`;
  };

  return (
    <>
      <Modal ref={modal}>
        <span className="block text-xl sm:text-2xl font-semibold text-center text-gray-800">
          Access <span className="text-red-600 font-bold">Restricted</span>
        </span>
        <span className="block text-base sm:text-lg text-center text-gray-600 mt-3 sm:mt-4">
          <span className="font-medium">Please log in</span> to continue and explore job opportunities.{" "}
          <span
            className="underline text-teal-500 hover:text-teal-600 cursor-pointer transition-colors duration-200"
            onClick={() => navigate("/SignUp")}
          >
            Sign up here
          </span>{" "}
          to get started!
        </span>
      </Modal>

      <div
        className={`border rounded-lg p-4 sm:p-5 bg-white shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full ${className}`}
      >
        {/* Days Left and Featured Badge */}
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <span className="text-sm text-gray-600 flex items-center gap-1.5">
            <FaCalendarCheck size={14} className={`text-teal-500 ${iconClassName}`} />
            {formatPostingDate(postingDate)}
          </span>
          <span className="bg-teal-500 text-white text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wide">
            Featured
          </span>
        </div>

        {/* Company Logo and Name */}
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="flex flex-col items-center space-y-1.5">
           


            <img
            src={getDriveImageUrl(companyLogo) || "/default-profile.jpg"}
            alt="companyLogo"
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-teal-200"
            onError={(e) => (e.target.src = "/default-profile.jpg")}  
            />
            <span className="text-gray-700 text-sm sm:text-base font-medium text-center">
              {companyName}
            </span>
          </div>

          {/* Job Details */}
          <div className="flex-1 space-y-1.5 sm:space-y-2 text-gray-700 text-sm">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 leading-tight">
              {jobTitle}
            </h2>
            <p className="flex items-center gap-1.5">
              <MapPin size={14} className={`text-teal-500 ${iconClassName}`} /> {location}
            </p>
            <p className="flex items-center gap-1.5">
              <Clock size={14} className={`text-teal-500 ${iconClassName}`} /> {jobType}
            </p>
            <p className="flex items-center gap-1.5">
              <FaDollarSign size={14} className={`text-teal-500 ${iconClassName}`} /> {salary}
            </p>
            <p className="flex items-center gap-1.5">
              <FaBriefcase size={14} className={`text-teal-500 ${iconClassName}`} /> 1 year and Above
            </p>
            <p className="flex items-center gap-1.5">
              <Users size={14} className={`text-teal-500 ${iconClassName}`} /> 1 Position
            </p>
          </div>
        </div>

        {/* Job Type Badge */}
        <div className="flex items-center justify-center bg-teal-100 text-teal-700 py-1.5 mt-3 sm:mt-4 rounded-md text-sm font-medium">
          <CheckCircle size={14} className={`mr-1.5 text-teal-500 ${iconClassName}`} /> {jobType}
        </div>

        {/* Quick Tags */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 sm:mt-4">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-teal-50 text-teal-600 text-xs sm:text-sm px-2 py-0.5 rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Company Rating */}
        {companyRating && (
          <div className="flex items-center mt-3 sm:mt-4">
            {[...Array(5)].map((_, index) => (
              <FaStar
                key={index}
                size={14}
                className={index < companyRating ? "text-yellow-400" : "text-gray-300"}
              />
            ))}
            <span className="text-gray-500 text-sm ml-1.5">({companyRating}.0)</span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
          <Button
            onClick={saveJob}
            disabled={isAuthenticated}
            className="flex-1 border border-teal-500 text-teal-500 hover:bg-teal-50 text-sm sm:text-base py-2 rounded-lg"
          >
            <FaBookmark className="inline-block mr-1.5 text-teal-500" /> Save
          </Button>
          <Button
            onClick={applyForJob}
            disabled={isAuthenticated}
            className="flex-1 bg-teal-500 text-white hover:bg-teal-600 text-sm sm:text-base py-2 rounded-lg"
          >
            Apply Now
          </Button>
        </div>
      </div>
    </>
  );
}

JobListing.propTypes = {
  jobTitle: PropTypes.string.isRequired,
  companyName: PropTypes.string.isRequired,
  companyLogo: PropTypes.string,
  location: PropTypes.string.isRequired,
  salary: PropTypes.string.isRequired,
  jobType: PropTypes.string.isRequired,
  postingDate: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string),
  companyRating: PropTypes.number,
  className: PropTypes.string, // Added from FeaturedJobs
  iconClassName: PropTypes.string, // Added from FeaturedJobs
};

export default JobListing;