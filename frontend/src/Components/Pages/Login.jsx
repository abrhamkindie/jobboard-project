import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import BASE_URL from "../API";
import axios from "axios";

export const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, formData);
      const { role, token, name, profile_picture_url, companyLogo, userFullName, employerId, userId, userEmail } = response.data;

      // Store data in localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("role", role);
      localStorage.setItem("name", name);
      localStorage.setItem("profile_picture_url", profile_picture_url);
      localStorage.setItem("companyLogo", companyLogo);
      localStorage.setItem("userFullName", userFullName);
      localStorage.setItem("employer_id", employerId);
      localStorage.setItem("user_Id", userId);
      localStorage.setItem("userEmail", userEmail);
  
      // Trigger the custom event for login
      window.dispatchEvent(new Event("authChange"));

      // Navigate to dashboard based on role
      navigate(role === "seeker" ? "/JobSeekerDash" : "/EmpDash");
    } catch (err) {
      console.error(err);
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-8 sm:py-10 bg-white">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-teal-600 mb-6 sm:mb-8 tracking-tight">
        Log In
      </h2>
      {error && (
        <p className="text-sm sm:text-base text-red-600 bg-red-50 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 text-center mb-4 sm:mb-5">
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <div>
          <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm sm:text-base bg-white"
          />
        </div>
        <div>
          <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm sm:text-base bg-white"
          />
        </div>
        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-sm sm:text-base text-teal-600 hover:text-teal-700 font-medium"
          >
            Forgot Password?
          </Link>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 sm:px-5 sm:py-2.5 bg-teal-500 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md disabled:bg-teal-300 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
        <div className="text-center mt-3 sm:mt-4">
          <p className="text-sm sm:text-base text-gray-600">
            Don’t have an account?{" "}
            <Link to="/signup" className="font-semibold text-teal-600 hover:text-teal-700">
              Sign up here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};