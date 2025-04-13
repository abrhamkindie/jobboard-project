import PropTypes from 'prop-types';

export const SideContents = ({ children, onClick, ...props }) => {
  return (
    <button 
      className="cursor-pointer w-full text-left flex justify-between items-center p-3 rounded-lg 
                hover:bg-teal-100 active:bg-teal-200 transition-colors duration-200 
                font-medium text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
      onClick={() => onClick(children)} 
      {...props}
    >
      {children} 
    </button>
  );
};

SideContents.propTypes = {
  children: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};