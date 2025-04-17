import { useRef } from "react";
import PropTypes from "prop-types";
import { FaBookmark, FaDollarSign } from "react-icons/fa";
import { MapPin, Clock, CheckCircle, Users, ArrowLeft } from "lucide-react";
import Button from "../Button"; // Adjust path
import ApplicationModal from "../Modals/ApplicationModal";

const Card = ({ children, className = "" }) => (
  <div className={`bg-white p-6 rounded-lg shadow-sm border border-teal-100 ${className}`}>
    {children}
  </div>
);


const getDriveImageUrl = (url) => {

  if (!url || !url.includes("drive.google.com")) return null;

  // Extract file ID from different Google Drive URL formats
  const fileId = url.match(/(?:\/d\/|id=)([a-zA-Z0-9_-]+)/)?.[1];
  if (!fileId) return null;

  // Use Google's thumbnail proxy (works in <img> tags)
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
};

 

const JobDetails = ({
  selectedJob,
  setSelectedJob,
  role,
  authToken,
  savedJobs,
  appliedJobs,
  handleSaveJob,
  applyForJob,
  showApplicationModal,
  setShowApplicationModal,
  handleApplicationSubmit,
}) => {
  const modalRef = useRef();

  return (
    <>
      {/* Header */}
      <Card className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
         
          <img
          src={getDriveImageUrl(selectedJob.company_logo ) || "/default-profile.jpg"}
          alt={selectedJob.company_name}
          className="w-14 h-14 rounded-lg object-cover border-2 border-teal-100 hover:border-teal-500 transition-all duration-300"
          onError={(e) => (e.target.src = "/default-profile.jpg")}  
          />

          <div>
            <h2 className="text-xl font-bold text-teal-700 hover:text-teal-800 transition-all duration-300">
              {selectedJob.job_title}
            </h2>
            <p className="text-base text-gray-600">
              at <span className="font-semibold text-gray-800">{selectedJob.company_name}</span>
            </p>
          </div>
        </div>
        <Button
          onClick={() => setSelectedJob(null)}
          className="bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-teal-700 transition-all duration-300 flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to Jobs
        </Button>
      </Card>

      {/* Job Details */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-base">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-teal-600" />
            <p>
              <span className="font-semibold">Location:</span> {selectedJob.location}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-teal-600" />
            <p>
              <span className="font-semibold">Type:</span> {selectedJob.employment_type}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <FaDollarSign size={16} className="text-teal-600" />
            <p>
              <span className="font-semibold">Salary:</span>{" "}
              {selectedJob.salary_range || "Not specified"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Users size={16} className="text-teal-600" />
            <p>
              <span className="font-semibold">Deadline:</span>{" "}
              {selectedJob.application_deadline
                ? new Date(selectedJob.application_deadline).toLocaleDateString()
                : "Not specified"}
            </p>
          </div>
        </div>
      </Card>

      {/* Job Description */}
      <Card className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Job Description</h3>
        <p className="text-base text-gray-700">{selectedJob.job_description || "Not provided"}</p>
      </Card>

      {/* Key Responsibilities */}
      <Card className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Key Responsibilities</h3>
        <div className="space-y-2 text-base text-gray-700">
          {selectedJob.key_responsibilities?.split("\n").map((responsibility, index) => (
            <div key={index} className="flex items-start gap-2">
              <CheckCircle size={16} className="text-teal-600 flex-shrink-0 mt-1" />
              <p>{responsibility || "Not specified"}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Requirements */}
      <Card className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Requirements</h3>
        <div className="space-y-2 text-base text-gray-700">
          {selectedJob.requirements?.split("\n").map((requirement, index) => (
            <div key={index} className="flex items-start gap-2">
              <CheckCircle size={16} className="text-teal-600 flex-shrink-0 mt-1" />
              <p>{requirement || "Not specified"}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Preferred Qualifications */}
      <Card className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Preferred Qualifications</h3>
        <div className="space-y-2 text-base text-gray-700">
          {selectedJob.preferred_qualifications?.split("\n").map((qualification, index) => (
            <div key={index} className="flex items-start gap-2">
              <CheckCircle size={16} className="text-teal-600 flex-shrink-0 mt-1" />
              <p>{qualification || "Not specified"}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Benefits */}
      <Card className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Benefits</h3>
        <div className="space-y-2 text-base text-gray-700">
          {selectedJob.benefits?.split("\n").map((benefit, index) => (
            <div key={index} className="flex items-start gap-2">
              <CheckCircle size={16} className="text-teal-600 flex-shrink-0 mt-1" />
              <p>{benefit || "Not specified"}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* How to Apply */}
      <Card className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">How to Apply</h3>
        <p className="text-base text-gray-700">{selectedJob.how_to_apply || "Not provided"}</p>
      </Card>

      {/* Action Buttons */}
      {role === "seeker" && (
        <div className="flex justify-center gap-4 mt-6">
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
              className={savedJobs.includes(selectedJob.id) ? "text-amber-700" : "text-teal-700"}
            />
            {savedJobs.includes(selectedJob.id) && authToken ? "Saved" : "Save"}
          </Button>

          <Button
            onClick={() =>
             setShowApplicationModal(true)}
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
    </>
  );
};

JobDetails.propTypes = {
  selectedJob: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    job_title: PropTypes.string.isRequired,
    company_name: PropTypes.string.isRequired,
    company_logo: PropTypes.string,
    location: PropTypes.string.isRequired,
    employment_type: PropTypes.string.isRequired,
    salary_range: PropTypes.string,
    application_deadline: PropTypes.string,
    job_description: PropTypes.string,
    key_responsibilities: PropTypes.string,
    requirements: PropTypes.string,
    preferred_qualifications: PropTypes.string,
    benefits: PropTypes.string,
    how_to_apply: PropTypes.string,
  }).isRequired,
  setSelectedJob: PropTypes.func.isRequired,
  role: PropTypes.string.isRequired,
  authToken: PropTypes.string,
  savedJobs: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
  appliedJobs: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
  handleSaveJob: PropTypes.func.isRequired,
  applyForJob: PropTypes.func.isRequired,
  showApplicationModal: PropTypes.bool.isRequired,
  setShowApplicationModal: PropTypes.func.isRequired,
  handleApplicationSubmit: PropTypes.func.isRequired,
};

export default JobDetails;