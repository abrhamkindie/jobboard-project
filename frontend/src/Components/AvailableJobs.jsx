import Button from "./Button";
import PropTypes from 'prop-types';

function AvailableJobs({
  jobSector,
  location,
  salary,
  Deadline,
  looking,
  company,
  howToApply,
  about,
  profile,
}) {
  return (
    <section className="flex flex-col lg:flex-row border border-teal-200 rounded-lg shadow-sm hover:shadow-md mx-4 sm:mx-6 lg:mx-8 my-4 p-4 sm:p-5 bg-white transition-all duration-200">
      <div className="lg:w-2/3 pr-0 lg:pr-6 text-gray-600">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-gray-800 mb-2 sm:mb-3 tracking-tight">
          {jobSector}
        </h1>
        <p className="text-base sm:text-lg font-semibold text-teal-600 mb-2 sm:mb-3">
          {company}
        </p>
        <p className="text-sm sm:text-base font-medium">
          <span className="font-semibold text-gray-800">Location: </span>
          {location}
        </p>
        <p className="text-sm sm:text-base font-medium">
          <span className="font-semibold text-gray-800">Salary Range: </span>
          {salary}
        </p>
        <p className="text-sm sm:text-base font-medium mb-3 sm:mb-4">
          <span className="font-semibold text-gray-800">Application Deadline: </span>
          {Deadline}
        </p>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
          {looking}
        </p>
        <p className="text-base sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2">
          How to Apply:
        </p>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
          {howToApply}
        </p>
        <Button className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base bg-teal-500 text-white hover:bg-teal-600 rounded-lg">
          Apply Now
        </Button>
      </div>
      <div className="lg:w-1/3 mt-4 lg:mt-0 bg-teal-50 rounded-lg p-4 sm:p-5">
        <img
          src={profile}
          alt={`${company} profile`}
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-md mb-3 sm:mb-4 object-cover mx-auto"
        />
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          {about}
        </p>
      </div>
    </section>
  );
}

AvailableJobs.propTypes = {
  jobSector: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  salary: PropTypes.string.isRequired,
  Deadline: PropTypes.string.isRequired,
  company: PropTypes.string.isRequired,
  looking: PropTypes.string.isRequired,
  howToApply: PropTypes.string.isRequired,
  about: PropTypes.string.isRequired,
  profile: PropTypes.string.isRequired,
};

export default AvailableJobs;