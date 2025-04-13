import PropTypes from "prop-types";
import { FaCalendarCheck, FaDollarSign, FaBriefcase, FaBookmark } from "react-icons/fa";
import { MapPin, Clock, CheckCircle, Users } from "lucide-react";
import Button from "../Button";

function JobCard({
  job,
  handleJobClick,
  activeJobId,
  savedJobs,
  appliedJobs,
  role,
  authToken,
  tags,
  handleSaveJob,
  applyForJob,
  formatPostingDate,
}) {
  // Calculate days left and status (unchanged)
  const calculateDaysLeft = (deadline) => {
    if (!deadline) return { status: "Open", days: null, displayText: "" };
    
    const currentDate = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate - currentDate;
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) {
      return { status: "Expired", days: 0, displayText: "Expired" };
    }
    return { 
      status: "Open", 
      days: daysLeft,
      displayText: `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`
    };
  };

  const deadlineInfo = calculateDaysLeft(job.application_deadline);

  const getBadge = () => {
    const now = new Date();
    const posted = new Date(job.created_at);
    const diffInDays = Math.floor((now - posted) / (1000 * 60 * 60 * 24));
    
    if (deadlineInfo.status === "Expired") {
      return {
        label: "Expired",
        color: "bg-gradient-to-r from-red-500 to-rose-500",
      };
    }
    if (diffInDays <= 7) {
      return {
        label: "Just Listed",
        color: "bg-gradient-to-r from-green-500 to-emerald-500",
      };
    }
    return {
      label: "Open",
      color: "bg-gradient-to-r from-teal-500 to-cyan-500",
    };
  };

  const badge = getBadge();

  return (
    <div
      onClick={() => handleJobClick(job)}
      className={`border rounded-xl p-3 shadow-sm bg-white w-full sm:w-64 lg:w-72 hover:border-teal-600 hover:cursor-pointer transition-all duration-300 ${
        activeJobId === job.id
          ? "bg-teal-100 border-l-4 border-teal-500"
          : "bg-white hover:bg-teal-50"
      }`}
    >
      {/* Deadline/Days Left and Status Badge */}
      <div className="flex justify-between items-center mb-1 relative">
        <span className="text-xs text-gray-600 flex gap-1">
          <FaCalendarCheck size={14} className={
            deadlineInfo.status === "Expired" ? "text-red-600" : "text-teal-600"
          } />
          {job.application_deadline 
            ? formatPostingDate(job.created_at, job.application_deadline)
            : formatPostingDate(job.created_at)}
        </span>
        <span
          className={`${badge.color} text-white text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-tl-md rounded-br-md shadow-lg transform -skew-x-12 uppercase tracking-wide transition-all duration-300`}
        >
          {badge.label}
        </span>
      </div>

      {/* Company Logo and Name */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <div className="flex flex-col items-center space-y-1 w-full sm:w-1/3">
          <img
            src={job.company_logo || "/default-logo.png"}
            alt={job.company_name}
            className="w-10 sm:w-12 h-10 sm:h-12 rounded-full border-2 border-teal-100"
          />
          <span className="text-gray-700 text-xs sm:text-sm font-medium text-center">{job.company_name}</span>
        </div>

        {/* Location, Job Type, Salary, and Positions */}
        <div className="mt-1 sm:mt-2 space-y-1 text-gray-700 text-xs sm:text-sm w-full sm:w-2/3">
          <h2 className="text-sm sm:text-md font-bold text-teal-700 line-clamp-2">{job.job_title}</h2>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1">
            <p className="flex items-center gap-1 truncate">
              <MapPin size={12} className="text-teal-600 flex-shrink-0" /> 
              <span className="truncate">{job.location}</span>
            </p>
            <p className="flex items-center gap-1 truncate">
              <Clock size={12} className="text-teal-600 flex-shrink-0" /> 
              <span className="truncate">{job.employment_type}</span>
            </p>
            <p className="flex items-center gap-1 truncate">
              <FaDollarSign size={12} className="text-teal-600 flex-shrink-0" /> 
              <span className="truncate">{job.salary_range}</span>
            </p>
            <p className="flex items-center gap-1 truncate">
              <FaBriefcase size={12} className="text-teal-600 flex-shrink-0" /> 
              <span className="truncate">1+ year</span>
            </p>



            <p className="flex items-center gap-1 truncate">
              <Users size={12} className="text-teal-600 flex-shrink-0" /> 
              <span className="truncate">1 Position</span>
            </p>



            
          </div>
        </div>
      </div>

      {/* Job Type Badge */}
      <div className="flex items-center justify-center bg-teal-600 text-white py-0.5 mt-2 rounded-md shadow-sm text-xs sm:text-sm">
        <CheckCircle size={12} className="mr-1" /> {job.employment_type}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 sm:gap-2 mt-2 sm:mt-3">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="bg-teal-100 text-teal-800 text-xs sm:text-sm px-2 py-0.5 sm:py-1 rounded-md shadow-sm"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-2 mt-3">
        {role !== "employer" && (
          <>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleSaveJob(job);
              }}
              className={`border px-2 sm:px-3 py-1 sm:py-2 rounded-lg transition-all duration-300 inline-flex items-center justify-center text-xs sm:text-sm ${
                savedJobs.includes(job.id)
                  ? "bg-amber-50 text-amber-700 border-amber-600 hover:bg-amber-100 hover:border-amber-700"
                  : "bg-teal-50 text-teal-700 border-teal-600 hover:bg-teal-100 hover:border-teal-700"
              }`}
              aria-label={savedJobs.includes(job.id) ? "Unsave job" : "Save job"}
              disabled={deadlineInfo.status === "Expired"}
            >
              <FaBookmark
                className={`inline-block mr-1 sm:mr-2 ${
                  savedJobs.includes(job.id) ? "text-amber-700" : "text-teal-700"
                }`}
                size={12}
              />
              <span className="font-medium">
                {savedJobs.includes(job.id) && authToken ? "Saved" : "Save"}
              </span>
            </Button>

            <Button
              onClick={(e) => {
                e.stopPropagation();
                applyForJob(job);
              }}
              className={`px-3 sm:px-4 py-1 sm:py-2 rounded-lg transition-all duration-300 shadow-sm text-xs sm:text-sm font-medium ${
                appliedJobs.includes(job.id) || deadlineInfo.status === "Expired"
                  ? "bg-gradient-to-r from-gray-400 to-gray-500 text-gray-100 cursor-not-allowed"
                  : "bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-700 hover:to-teal-800"
              }`}
              aria-label={
                appliedJobs.includes(job.id) ? "Applied" : 
                deadlineInfo.status === "Expired" ? "Closed" : "Apply"
              }
              disabled={appliedJobs.includes(job.id) || deadlineInfo.status === "Expired"}
            >
              {appliedJobs.includes(job.id) 
                ? "Applied" 
                : deadlineInfo.status === "Expired" 
                  ? "Closed" 
                  : "Apply Now"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

// Prop types remain unchanged
JobCard.propTypes = {
  job: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    job_title: PropTypes.string.isRequired,
    company_name: PropTypes.string.isRequired,
    company_logo: PropTypes.string,
    location: PropTypes.string.isRequired,
    employment_type: PropTypes.string.isRequired,
    salary_range: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    application_deadline: PropTypes.string,
  }).isRequired,
  handleJobClick: PropTypes.func.isRequired,
  activeJobId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  savedJobs: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
  appliedJobs: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
  role: PropTypes.string.isRequired,
  authToken: PropTypes.string,
  handleSaveJob: PropTypes.func.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string),
  applyForJob: PropTypes.func.isRequired,
  formatPostingDate: PropTypes.func.isRequired,
};

export default JobCard;