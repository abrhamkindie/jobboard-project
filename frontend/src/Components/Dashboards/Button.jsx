import PropTypes from 'prop-types';
export default function Button( {children, ...props} ){

 return(
<>
<button className =" rounded-md bg-blue-600 text-gray-50 px-4 py-2 hover:bg-blue-400 font-bold"{...props} >
     {children}</button>

</>)
}
Button.propTypes = {
     children: PropTypes.string.isRequired, 
    
   };
    