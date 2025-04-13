import PropTypes from 'prop-types';
import { forwardRef, useRef, useImperativeHandle } from "react";
import { createPortal } from "react-dom";

const Modal = forwardRef(function Modal({ children }, ref) {
  const dialog = useRef();

  useImperativeHandle(ref, () => ({
    open() {
      dialog.current.showModal();
    },
    close() {
      dialog.current.close();
    },
  }));

  return createPortal(
    <dialog
      ref={dialog}
      className="backdrop:bg-gray-900/80 p-4 sm:p-6 rounded-lg shadow-xl border-0 bg-white max-w-md w-full"
    >
      <div className="text-center text-gray-800">
        {children}
      </div>
      <form method="dialog" className="mt-4 sm:mt-6 flex justify-center">
        <button
          type="submit"
          className="px-4 py-2 text-sm sm:text-base rounded-lg bg-teal-500 text-white hover:bg-teal-600 focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 transition-all duration-200"
        >
          Close
        </button>
      </form>
    </dialog>,
    document.getElementById("modal-root")
  );
});

export default Modal;

Modal.propTypes = {
  children: PropTypes.node.isRequired,
};