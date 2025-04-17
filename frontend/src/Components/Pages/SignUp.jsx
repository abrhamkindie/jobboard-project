import { useState } from 'react';
import axios from 'axios';
import BASE_URL from '../API';
import { Link, useNavigate } from 'react-router-dom';

export const SignUp = () => {
  const [role, setRole] = useState('');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
    terms: false,
    job_title: '',
    skills: '',
    experience_level: 'Entry-level',
    location_preference: 'remote',
    resume: null,
    profile: null,
    company_name: '',
    industry: '',
    company_size: 'small',
    job_description: '',
    logo: null,
  });

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.password !== formData.confirm_password) {
      alert('Passwords do not match.');
      return;
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(formData.password)) {
      alert(
        'Password must be at least 6 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.'
      );
      return;
    }

    // Validate terms are agreed upon
    if (!formData.terms) {
      alert('You must agree to the terms and conditions.');
      return;
    }

    // Validate role is selected
    if (!role) {
      alert('Please select a role.');
      return;
    }

    // Create a FormData object and append each field manually
    const formDataToSubmit = new FormData();
    formDataToSubmit.append('full_name', formData.full_name);
    formDataToSubmit.append('email', formData.email);
    formDataToSubmit.append('phone', formData.phone);
    formDataToSubmit.append('password', formData.password);
    formDataToSubmit.append('confirm_password', formData.confirm_password);
    formDataToSubmit.append('role', role);
    formDataToSubmit.append('terms', formData.terms);

    if (role === 'seeker') {
      formDataToSubmit.append('job_title', formData.job_title);
      formDataToSubmit.append('skills', formData.skills);
      formDataToSubmit.append('experience_level', formData.experience_level);
      formDataToSubmit.append('location_preference', formData.location_preference);

      if (formData.resume) {
        formDataToSubmit.append('resume', formData.resume);
      }
      if (formData.profile) {
        formDataToSubmit.append('profile', formData.profile);
      }
    } else if (role === 'employer') {
      formDataToSubmit.append('company_name', formData.company_name);
      formDataToSubmit.append('industry', formData.industry);
      formDataToSubmit.append('company_size', formData.company_size);
      formDataToSubmit.append('job_description', formData.job_description);

      if (formData.logo) {
        formDataToSubmit.append('logo', formData.logo);
      }
    }

    console.log('FormData to be sent:', [...formDataToSubmit.entries()]);

    try {
      const res = await axios.post(`${BASE_URL}/auth/signup`, formDataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data) {
        setTimeout(() => navigate('/login'), 2000);
        alert('✅ Sign up successful!');
      }
    } catch (err) {
      console.error('Error during sign up:', err);

      if (err.response) {
        alert('❌ Error signing up: ' + (err.response.data.error || 'An unknown error occurred.'));
      } else {
        alert('❌ Error signing up: Unable to connect to the server.');
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-8 sm:py-10 bg-white">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-teal-600 mb-6 sm:mb-8 tracking-tight">
        Job Board Sign-Up
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {/* Role Selection */}
        <div>
          <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
            Select Role
          </label>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <label className="flex items-center text-sm sm:text-base text-gray-600">
              <input
                type="radio"
                name="role"
                value="seeker"
                onChange={handleRoleChange}
                className="mr-2 text-teal-500 focus:ring-teal-400 h-4 w-4"
                required
              />
              Job Seeker
            </label>
            <label className="flex items-center text-sm sm:text-base text-gray-600">
              <input
                type="radio"
                name="role"
                value="employer"
                onChange={handleRoleChange}
                className="mr-2 text-teal-500 focus:ring-teal-400 h-4 w-4"
                required
              />
              Employer
            </label>
          </div>
        </div>

        {/* Common Fields */}
        <div>
          <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm sm:text-base bg-white"
          />
        </div>
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
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
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
        <div>
          <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm sm:text-base bg-white"
          />
        </div>

        {/* Conditional Fields for Job Seeker */}
        {role === 'seeker' && (
          <>
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                Desired Job Title
              </label>
              <input
                type="text"
                name="job_title"
                value={formData.job_title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm sm:text-base bg-white"
              />
            </div>
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                Skills
              </label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                required
                placeholder="e.g., JavaScript, Python, Project Management"
                className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm sm:text-base bg-white"
              />
            </div>
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                Experience Level
              </label>
              <select
                name="experience_level"
                value={formData.experience_level}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm sm:text-base bg-white"
              >
                <option value="Entry-level">Entry-level</option>
                <option value="Mid-level">Mid-level</option>
                <option value="Senior">Senior</option>
                <option value="Executive">Executive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                Location Preference
              </label>
              <select
                name="location_preference"
                value={formData.location_preference}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm sm:text-base bg-white"
              >
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">On-site</option>
              </select>
            </div>
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                Upload Resume
              </label>
              <input
                type="file"
                name="resume"
                accept=".pdf,.doc,.docx"
                onChange={handleChange}
                className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm sm:text-base bg-white"
              />
            </div>
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                Upload Profile Picture
              </label>
              <input
                type="file"
                name="profile"
                accept="image/*"
                onChange={handleChange}
                className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm sm:text-base bg-white"
              />
            </div>
          </>
        )}

        {/* Conditional Fields for Employer */}
        {role === 'employer' && (
          <>
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                Company Name
              </label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm sm:text-base bg-white"
              />
            </div>
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                Industry
              </label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm sm:text-base bg-white"
              />
            </div>
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                Company Size
              </label>
              <select
                name="company_size"
                value={formData.company_size}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm sm:text-base bg-white"
              >
                <option value="small">Small (1-50 employees)</option>
                <option value="medium">Medium (51-200 employees)</option>
                <option value="large">Large (201+ employees)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                Job Description
              </label>
              <textarea
                name="job_description"
                value={formData.job_description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm sm:text-base bg-white"
              />
            </div>
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                Upload Company Logo
              </label>
              <input
                type="file"
                name="logo"
                accept="image/*"
                onChange={handleChange}
                className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm sm:text-base bg-white"
              />
            </div>
          </>
        )}

        {/* Terms & Conditions */}
        <div>
          <label className="flex items-center text-sm sm:text-base text-gray-600">
            <input
              type="checkbox"
              name="terms"
              checked={formData.terms}
              onChange={handleChange}
              required
              className="mr-2 text-teal-500 focus:ring-teal-400 h-4 w-4"
            />
            I agree to the{' '}
            <Link to="/terms" className="text-teal-600 hover:text-teal-700 font-medium">
              Terms & Conditions
            </Link>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full px-4 py-2 sm:px-5 sm:py-2.5 bg-teal-500 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Sign Up
        </button>
        <div className="text-center mt-3 sm:mt-4">
          <p className="text-sm sm:text-base text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-teal-600 hover:text-teal-700">
              Log in here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};