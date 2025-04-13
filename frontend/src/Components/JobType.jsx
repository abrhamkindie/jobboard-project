import PropTypes from 'prop-types';

export default function JobType({
  name = 'job-type',
  className = '',
  selectedValue = '',
  onChange = () => {},
}) {
  const jobOptions = ['Full-time', 'Part-time', 'Contract'];

  return (
    <select
      name={name}
      className={`w-full sm:w-auto px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed appearance-none bg-right bg-no-repeat ${className}`}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234B5563' class='h-5 w-5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7' /%3E%3C/svg%3E")`,
        backgroundSize: '1.25rem',
        backgroundPosition: 'right 0.75rem center',
      }}
      value={selectedValue}
      onChange={onChange}
    >
      <option value="">Select Job Type</option>
      {jobOptions.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

JobType.propTypes = {
  name: PropTypes.string,
  className: PropTypes.string,
  selectedValue: PropTypes.string,
  onChange: PropTypes.func, // Corrected from PropTypes.string
};