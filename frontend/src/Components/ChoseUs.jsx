import PropTypes from 'prop-types';

export default function ChoseUs({ advantage, description, className }) {
  return (
    <div
      className={`flex flex-col border border-teal-200 rounded-lg p-4 sm:p-5 bg-white shadow-sm hover:shadow-md transition-all duration-200 w-full max-w-md ${className}`}
    >
      <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-teal-600 mb-2 sm:mb-3 tracking-tight">
        {advantage}
      </h2>
      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

ChoseUs.propTypes = {
  advantage: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  className: PropTypes.string,
};

ChoseUs.defaultProps = {
  className: '',
};