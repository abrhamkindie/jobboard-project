import PropTypes from "prop-types";
import { useState, forwardRef, useRef, useImperativeHandle } from "react";
import { createPortal } from "react-dom";

const ApplicationModal = forwardRef(function ApplicationModal({ onApply, closeErrorDialog }, ref) {
  const userEmail = localStorage.getItem("userEmail");
  const userName = localStorage.getItem("name");
  const dialog = useRef();

  const [formData, setFormData] = useState({
    fullName: `${userName}`,
    email: `${userEmail}`,
    phone: "",
    resume: null,
    coverLetter: "",
    linkedIn: "",
    portfolio: "",
    consent: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useImperativeHandle(ref, () => ({
    open() {
      dialog.current.showModal();
    },
    close() {
      dialog.current.close();
    },
  }));

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate file type
    if (formData.resume && formData.resume instanceof File) {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ];
    
      // Get the file extension
      const fileName = formData.resume.name;
      const fileExtension = fileName.split(".").pop().toLowerCase();
    
      // Validate MIME type and file extension
      if (
        !allowedTypes.includes(formData.resume.type) ||
        !["pdf", "doc", "docx"].includes(fileExtension)
      ) {
        alert("Please upload a valid file (PDF, DOC, or DOCX).");
        return;
      }
    } else {
      alert("⚠️ Please upload a resume file.");
      return;
    }

    // Validate consent
    if (!formData.consent) {
      alert("Please agree to the terms and conditions.");
      return;
    }

    setIsLoading(true);
    try {
      await onApply(formData);  
      setSuccessMessage("Application submitted successfully!");
      setTimeout(() => {
        dialog.current.close();
        setSuccessMessage("");
      }, 2000); // Close the modal after 2 seconds
    } catch (error) {
      alert("Error submitting application. Please try again.", error);
    } finally {
      setIsLoading(false);
    }
  };

  return createPortal(
    <dialog
      ref={dialog}
      className="fixed inset-0 backdrop:bg-black/50 bg-transparent flex justify-center items-center p-2 sm:p-4"
      aria-modal="true"
    >
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full sm:w-96 md:w-[28rem] min-w-[90vw] sm:min-w-0 max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={closeErrorDialog}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 p-1 sm:p-2 text-gray-600 hover:text-gray-800"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:h-6 sm:w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
  
        {/* Modal Title */}
        <h1 className="text-lg sm:text-xl font-semibold text-teal-600 mb-4">Job Application</h1>
  
        {/* Success Message */}
        {successMessage && (
          <div className="bg-teal-100 border border-teal-400 text-teal-700 px-3 sm:px-4 py-2 rounded-md mb-4 text-sm sm:text-base">
            {successMessage}
          </div>
        )}
  
        {/* Application Form */}
        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-4">
            <label className="block text-xs sm:text-sm font-medium text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-teal-100 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
              required
              aria-label="Full Name"
            />
          </div>
  
          {/* Email */}
          <div className="mb-4">
            <label className="block text-xs sm:text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-teal-100 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
              required
              aria-label="Email"
            />
          </div>
  
          {/* Phone Number */}
          <div className="mb-4">
            <label className="block text-xs sm:text-sm font-medium text-gray-700">
              Phone Number <span className="text-gray-500">(Optional)</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-teal-100 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
              aria-label="Phone Number"
            />
          </div>
  
          {/* Resume Upload */}
          <div className="mb-4">
            <label className="block text-xs sm:text-sm font-medium text-gray-700">
              Resume/CV <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              name="resume"
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-teal-100 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
              accept=".pdf,.doc,.docx"
              required
              aria-label="Resume"
            />
          </div>
  
          {/* Cover Letter */}
          <div className="mb-4">
            <label className="block text-xs sm:text-sm font-medium text-gray-700">
              Cover Letter <span className="text-teal-600">(Recommended)</span>
            </label>
            <textarea
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-teal-100 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
              rows="4"
              aria-label="Cover Letter"
            />
          </div>
  
          {/* LinkedIn Profile */}
          <div className="mb-4">
            <label className="block text-xs sm:text-sm font-medium text-gray-700">
              LinkedIn Profile <span className="text-teal-600">(Recommended)</span>
            </label>
            <input
              type="text"
              name="linkedIn"
              value={formData.linkedIn}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-teal-100 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
              aria-label="LinkedIn Profile"
            />
          </div>
  
          {/* Portfolio/Website */}
          <div className="mb-4">
            <label className="block text-xs sm:text-sm font-medium text-gray-700">
              Portfolio/Website <span className="text-gray-500">(Optional)</span>
            </label>
            <input
              type="text"
              name="portfolio"
              value={formData.portfolio}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-teal-100 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
              aria-label="Portfolio/Website"
            />
          </div>
  
          {/* Consent Checkbox */}
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="consent"
                checked={formData.consent}
                onChange={handleChange}
                className="mr-2 text-teal-600 focus:ring-teal-500"
                required
                aria-label="Consent"
              />
              <span className="text-xs sm:text-sm text-gray-700">
                I agree to the privacy policy and terms of use. <span className="text-red-500">*</span>
              </span>
            </label>
          </div>
  
          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
            <button
              type="button"
              onClick={closeErrorDialog}
              className="px-3 sm:px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors w-full sm:w-auto"
              aria-label="Cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 sm:px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors w-full sm:w-auto"
              disabled={isLoading}
              aria-label="Submit Application"
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </dialog>,
    document.getElementById("modal-root")
  );
});

ApplicationModal.propTypes = {
  onApply: PropTypes.func.isRequired,
  closeErrorDialog: PropTypes.func.isRequired,
};

export default ApplicationModal;