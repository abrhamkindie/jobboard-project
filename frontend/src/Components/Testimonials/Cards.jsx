import PropTypes from 'prop-types';

function Cards({ source, title, name, expertAt, taught, className = "" }) {
  return (
    <div
      className={`flex flex-col items-center justify-between bg-white rounded-lg border border-teal-200 shadow-sm hover:shadow-md transition-all duration-200 p-4 sm:p-5 ${className}`}
    >
      <img
        src={source}
        alt={`${title}'s profile`}
        className="rounded-full w-20 h-20 sm:w-24 sm:h-24 border-2 border-teal-200 mb-3 sm:mb-4 object-cover"
      />
      <h1 className="text-base sm:text-lg font-semibold text-gray-800">
        {name}
      </h1>
      <h2 className="text-sm sm:text-base font-medium text-teal-600 mb-2 sm:mb-3">
        {expertAt}
      </h2>
      <p className="text-sm sm:text-base text-gray-600 italic text-center leading-relaxed">
        {taught}
      </p>
    </div>
  );
}

Cards.propTypes = {
  source: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  expertAt: PropTypes.string.isRequired,
  taught: PropTypes.string.isRequired,
  className: PropTypes.string, // Added to match Testimonials
};

export default Cards;