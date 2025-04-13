import { useState, useCallback, useEffect } from "react";
import BASE_URL from "../../API";
import axios from "axios";

export const Subscription = () => {
  const [showJobAlertsModal, setShowJobAlertsModal] = useState(false);
  const [showUnsubscribeModal, setShowUnsubscribeModal] = useState(false);
  const [preferences, setPreferences] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [frequency, setFrequency] = useState("daily"); // Default frequency
  const userEmail = localStorage.getItem("userEmail");
 

 
  const jobCategories = [
    "Software Engineering",
    "Data Science",
    "Networking",
    "Marketing",
    "Finance",
    "Healthcare",
    "Education",
    "Design",
    "Sales",
    "Customer Support",
  ];

  const frequencies = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
  ];

  const handlePreferenceChange = (category) => {
    setPreferences((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  // Fetch subscription status from the backend
  const fetchSubscriptionStatus = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/job_alerts/job_alerts`, {
        params: { email: userEmail },
      });

 
      const { isSubscribed, preferences, frequency } = response.data;

      setIsSubscribed(isSubscribed);
      setPreferences(Array.isArray(preferences) ? preferences : []);
      setFrequency(frequency || "daily");
    } catch (error) {
      console.error("Error fetching subscription status:", error);
      setPreferences([]);
    }
  }, [userEmail]);

  // Fetch subscription status when the component mounts or userEmail changes
  useEffect(() => {
    if (userEmail) {
      fetchSubscriptionStatus();
    }
  }, [userEmail, fetchSubscriptionStatus]);

  // Handle job alert subscription form submission
  const handleJobAlertSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/job_alerts/job_alerts`, {
        email: userEmail,
        preferences,
        frequency,
      });

      if (response.status === 200) {
        setIsSubscribed(true);
        setMessage(
          `🎉 Subscription successful! You will receive job alerts ${frequency}.`
        );
        setTimeout(() => {
          setShowJobAlertsModal(false);
          setMessage("");
        }, 3000);
      }
    } catch (error) {
      console.error("Error subscribing:", error);
      setMessage("❌ Error subscribing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle unsubscribe action
  const handleUnsubscribe = async () => {
    setLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/job_alerts/unsubscribe_job_alerts`,
        {
          email: userEmail,
        }
      );

      if (response.status === 200) {
        setIsSubscribed(false);
        setMessage("Unsubscribed successfully!");
        setShowUnsubscribeModal(false);
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error unsubscribing:", error);
      setMessage("❌ Error unsubscribing. Please try again.");
    } finally {
      setLoading(false);
    }
  };






   
  
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen p-4 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900">
        {/* Descriptive Content */}
        <div className="w-full max-w-2xl text-center mb-6 md:mb-10 p-4 md:p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-teal-800 mb-3 md:mb-4">
            Stay Updated with Job Alerts
          </h1>
          <p className="text-base md:text-lg text-gray-600 mb-3 md:mb-4 leading-relaxed">
            Subscribe to receive personalized job alerts tailored to your preferences. Never miss an
            opportunity to land your dream job!
          </p>
          <div className="text-gray-600 mb-4 text-left">
            <span className="font-semibold">What you get:</span>
            <ul className="list-disc list-inside space-y-1 mt-1">
              <li className="text-sm md:text-base">✅ Customized job recommendations</li>
              <li className="text-sm md:text-base">✅ Alerts based on your preferred categories</li>
              <li className="text-sm md:text-base">✅ Flexible frequency options</li>
            </ul>
          </div>
        </div>
  
        {/* Current Preferences (if subscribed) */}
        {isSubscribed && (
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg mb-4 md:mb-6 w-full max-w-md border border-teal-100">
            <h3 className="text-lg md:text-xl font-semibold text-teal-700 mb-3 md:mb-4">
              Your Current Preferences
            </h3>
            <div className="space-y-1 md:space-y-2 text-sm md:text-base text-gray-700">
              <p>
                <span className="font-medium text-teal-600">📅 Frequency:</span>{" "}
                {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
              </p>
              <p>
                <span className="font-medium text-teal-600">📂 Categories:</span>{" "}
                {(preferences || []).join(", ")}
              </p>
            </div>
          </div>
        )}
  
        {/* Subscribe/Unsubscribe Button */}
        <button
          onClick={
            isSubscribed
              ? () => setShowUnsubscribeModal(true)
              : () => setShowJobAlertsModal(true)
          }
          className={`px-4 py-2 md:px-6 md:py-3 text-sm md:text-base font-medium rounded-lg transition-all duration-300 ease-in-out transform ${
            isSubscribed
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-teal-600 text-white hover:bg-teal-700"
          } active:scale-95 focus:ring-2 focus:ring-offset-2 ${
            isSubscribed ? "focus:ring-red-300" : "focus:ring-teal-300"
          }`}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {isSubscribed ? "Unsubscribing..." : "Subscribing..."}
            </span>
          ) : isSubscribed ? (
            "🔔 Unsubscribe"
          ) : (
            "🔔 Subscribe"
          )}
        </button>
  
        {/* Job Alerts Modal */}
        {showJobAlertsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-xl md:shadow-2xl w-full max-w-sm md:w-96">
              <h2 className="text-xl md:text-2xl font-semibold text-teal-700 mb-3 md:mb-4 text-center">
                Subscribe to Job Alerts
              </h2>
  
              {message && (
                <p className="text-center text-xs md:text-sm font-medium mb-2 md:mb-3">{message}</p>
              )}
  
              <form onSubmit={handleJobAlertSubmit} className="space-y-3 md:space-y-4">
                {/* Job Preferences Selection */}
                <div>
                  <h3 className="text-base md:text-lg font-medium text-teal-700 mb-1 md:mb-2">Select Preferences:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 md:gap-2">
                    {jobCategories.map((category) => (
                      <label
                        key={category}
                        className="flex items-center space-x-2 bg-teal-50 p-1 md:p-2 rounded-md cursor-pointer hover:bg-teal-100"
                      >
                        <input
                          type="checkbox"
                          checked={preferences.includes(category)}
                          onChange={() => handlePreferenceChange(category)}
                          className="w-3 h-3 md:w-4 md:h-4 text-teal-600 focus:ring-teal-500"
                        />
                        <span className="text-xs md:text-sm text-gray-700">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
  
                {/* Frequency Selection */}
                <div>
                  <h3 className="text-base md:text-lg font-medium text-teal-700 mb-1 md:mb-2">Alert Frequency:</h3>
                  <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-1 sm:space-y-0">
                    {frequencies.map((freq) => (
                      <label key={freq.value} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          value={freq.value}
                          checked={frequency === freq.value}
                          onChange={() => setFrequency(freq.value)}
                          className="w-3 h-3 md:w-4 md:h-4 text-teal-600 focus:ring-teal-500"
                        />
                        <span className="text-xs md:text-sm text-gray-700">{freq.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
  
                {/* Buttons */}
                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowJobAlertsModal(false)}
                    className="px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
  
                  <button
                    type="submit"
                    className={`px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium rounded-lg ${
                      isSubscribed ? "bg-teal-500" : "bg-teal-600"
                    } text-white hover:bg-teal-700`}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : isSubscribed ? "Update" : "Subscribe"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
  
        {/* Unsubscribe Confirmation Modal */}
        {showUnsubscribeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-xl md:shadow-2xl w-full max-w-sm md:w-96">
              <h2 className="text-xl md:text-2xl font-semibold text-teal-700 mb-3 md:mb-4 text-center">
                Unsubscribe
              </h2>
  
              <p className="text-center text-xs md:text-sm font-medium mb-3 md:mb-4">
                Are you sure you want to unsubscribe from job alerts?
              </p>
  
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowUnsubscribeModal(false)}
                  className="px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
  
                <button
                  type="button"
                  onClick={handleUnsubscribe}
                  className="px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Unsubscribe"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };