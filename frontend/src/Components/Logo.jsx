import PropTypes from 'prop-types';

function Logo({ source, title, className = "", ...props }) {
  return (
    <img
      className={`h-10 sm:h-12 w-auto object-contain ${className}`}
      src={source}
      alt={title}
      {...props}
    />
  );
}

Logo.propTypes = {
  source: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  className: PropTypes.string, // Added to match other components
};

export default Logo;