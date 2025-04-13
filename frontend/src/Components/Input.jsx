import PropTypes from 'prop-types';

export default function Input({ placeholder, value, onChange, className = "", ...props }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full sm:w-auto px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    />
  );
}

Input.propTypes = {
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired, // Corrected from PropTypes.string
  className: PropTypes.string, // Added to match Button component
};