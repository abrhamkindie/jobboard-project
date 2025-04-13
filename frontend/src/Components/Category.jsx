import PropTypes from 'prop-types';

export default function Category({ children, className = "", ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 rounded-lg border border-teal-200 bg-white text-teal-600 text-sm sm:text-base font-semibold hover:bg-teal-50 hover:text-teal-700 focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

Category.propTypes = {
  children: PropTypes.node.isRequired, // Changed to node for flexibility
  className: PropTypes.string, // Added for consistency
};

Category.defaultProps = {
  className: '', // Added default for consistency
};