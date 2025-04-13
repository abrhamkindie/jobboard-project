import PropTypes from 'prop-types';

export default function EmpCard({ title, record1, record2, record3, onViewDetails, highlightColor, className = "" }) {
  return (
    <div
      className={`flex flex-col border border-teal-200 rounded-lg shadow-sm hover:shadow-md bg-white px-4 sm:px-5 py-4 sm:py-5 transition-all duration-200 h-full justify-between items-center ${className}`}
    >
      {/* Card Title with Dynamic Highlight */}
      <h1 className={`text-base sm:text-lg lg:text-xl font-semibold ${highlightColor || 'text-teal-600'} mb-2 sm:mb-3 tracking-tight`}>
        {title}
      </h1>

      {/* Card Records */}
      <div className="space-y-2 sm:space-y-3 text-center flex-1">
        <p className="text-sm sm:text-base text-gray-800 font-medium">{record1}</p>
        {record2 && <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{record2}</p>}
        {record3 && <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{record3}</p>}
      </div>

      {/* Call-to-Action Button */}
      <button
        onClick={onViewDetails}
        className="mt-3 sm:mt-4 px-3 py-1.5 sm:px-4 sm:py-2 bg-teal-500 text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-teal-600 focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 transition-all duration-200"
      >
        View Details
      </button>
    </div>
  );
}

EmpCard.propTypes = {
  title: PropTypes.string.isRequired,
  record1: PropTypes.string.isRequired,
  record2: PropTypes.string,
  record3: PropTypes.string,
  onViewDetails: PropTypes.func,
  highlightColor: PropTypes.string,
  className: PropTypes.string, // Added for flexibility
};

EmpCard.defaultProps = {
  record2: '',
  record3: '',
  onViewDetails: () => {},
  highlightColor: 'text-teal-600',
  className: '',
};