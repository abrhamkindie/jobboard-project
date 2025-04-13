 import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../API";
import Button from "../Button";

const EmployerProfile = () => {
  const [userProfile, setUserProfile] = useState({});
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    company_name: "",
    industry: "",
    company_size: "",
    job_description: "",
    logo: "",
    company_website: "",
    company_description: "",
    founded_year: "",
    location: "",
    linkedin: "",
    twitter: "",
    employee_benefits: "",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const employerId = localStorage.getItem("employer_id"); // Adjust based on your auth setup
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    if (!authToken || !employerId) {
      alert("You are not logged in. Redirecting to login page...");
      navigate("/login");
      return;
    }

    axios
      .get(`${BASE_URL}/profile/employer_profile`, {
        params: { user_id: employerId },
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((response) => {
        const data = response.data;
        setUserProfile(data);
        setProfile({
          full_name: data.full_name || "",
          email: data.email || "",
          phone: data.phone || "",
          company_name: data.company_name || "",
          industry: data.industry || "",
          company_size: data.company_size || "",
          job_description: data.job_description || "",
          logo: data.logo || "",
          company_website: data.company_website || "",
          company_description: data.company_description || "",
          founded_year: data.founded_year || "",
          location: data.location || "",
          linkedin: data.linkedin || "",
          twitter: data.twitter || "",
          employee_benefits: data.employee_benefits || "",
        });
        localStorage.setItem("companyLogo", data.logo || "");
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching employer profile:", error);
        setError("Failed to load profile. Please try again.");
        setLoading(false);
      });
  }, [employerId, authToken, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoFileChange = (e) => {
    setLogoFile(e.target.files[0]);
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("full_name", profile.full_name);
    formData.append("email", profile.email);
    formData.append("phone", profile.phone);
    formData.append("company_name", profile.company_name);
    formData.append("industry", profile.industry);
    formData.append("company_size", profile.company_size);
    formData.append("job_description", profile.job_description);
    formData.append("company_website", profile.company_website);
    formData.append("company_description", profile.company_description);
    formData.append("founded_year", profile.founded_year);
    formData.append("location", profile.location);
    formData.append("linkedin", profile.linkedin);
    formData.append("twitter", profile.twitter);
    formData.append("employee_benefits", profile.employee_benefits);
    formData.append("employer_id", employerId);
    if (logoFile) formData.append("logo", logoFile);

    console.log('Sending FormData:', [...formData.entries()]);

    axios
      .post(`${BASE_URL}/profile/update_employer_profile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((res) => {
        console.log('Update Response:', res.data);
        const updatedLogo = res.data.logo || profile.logo;
        setUserProfile({
          ...userProfile,
          ...profile,
          logo: updatedLogo,
        });
        localStorage.setItem("companyLogo", updatedLogo);
        alert("✅ " + res.data.message);
        setProfile((prev) => ({
          ...prev,
          logo: updatedLogo,
        }));
        setIsEditing(false);
        setLogoFile(null);
      })
      .catch((err) => {
        console.error("Update Error:", err.response?.data || err.message);
        alert("❌ Failed to update profile: " + (err.response?.data?.error || "Unknown error"));
      });
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setLogoFile(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 py-12">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-10">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-6">
            <h1 className="text-3xl font-bold text-teal-700">Employer Profile</h1>
            <Button
              onClick={toggleEdit}
              className="bg-teal-600 text-white px-6 py-2.5 rounded-md hover:bg-teal-700 transition-all duration-300 flex items-center gap-2 shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>

          {/* Profile Content */}
          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact Full Name</label>
                  <input
                    type="text"
                    name="full_name"
                    value={profile.full_name}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Name</label>
                  <input
                    type="text"
                    name="company_name"
                    value={profile.company_name}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Industry</label>
                  <input
                    type="text"
                    name="industry"
                    value={profile.industry}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Size</label>
                  <select
                    name="company_size"
                    value={profile.company_size}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  >
                    <option value="">Select Size</option>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                   </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Website</label>
                  <input
                    type="url"
                    name="company_website"
                    value={profile.company_website}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Founded Year</label>
                  <input
                    type="number"
                    name="founded_year"
                    value={profile.founded_year}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g., 2010"
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={profile.location}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g., San Francisco, CA"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
                  <input
                    type="url"
                    name="linkedin"
                    value={profile.linkedin}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="https://linkedin.com/company/example"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Twitter</label>
                  <input
                    type="url"
                    name="twitter"
                    value={profile.twitter}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="https://twitter.com/example"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Job Description</label>
                <textarea
                  name="job_description"
                  value={profile.job_description}
                  onChange={handleChange}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  rows="5"
                  placeholder="Describe the job opportunities at your company"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Description</label>
                <textarea
                  name="company_description"
                  value={profile.company_description}
                  onChange={handleChange}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  rows="5"
                  placeholder="e.g., We are a tech company focused on innovation."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Employee Benefits</label>
                <textarea
                  name="employee_benefits"
                  value={profile.employee_benefits}
                  onChange={handleChange}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  rows="3"
                  placeholder="e.g., Health insurance, remote work, paid time off"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Logo</label>
                <input
                  type="file"
                  name="logo"
                  accept="image/*"
                  onChange={handleLogoFileChange}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                />
                {profile.logo && !logoFile && (
                  <p className="mt-2 text-sm text-gray-600">Current: {profile.logo}</p>
                )}
                {logoFile && (
                  <p className="mt-2 text-sm text-gray-600">New file selected: {logoFile.name}</p>
                )}
              </div>
              <div className="flex justify-end gap-4">
                <Button
                  onClick={toggleEdit}
                  className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-all duration-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition-all duration-300 flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Save Changes
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-10">
              {/* Profile Overview */}
              <section className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-semibold text-teal-600 mb-4">Profile Overview</h2>
                <div className="flex items-start gap-8">
                  <img
                    src={profile.logo ? `${BASE_URL}${profile.logo}` : "/default-logo.jpg"}
                    alt="Company Logo"
                    className="w-28 h-28 rounded-full object-cover border-2 border-teal-200 shadow-md"
                    onError={(e) => (e.target.src = "/default-logo.jpg")}
                  />
                  <div className="flex-1 space-y-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Contact Name</span>
                      <p className="text-lg font-semibold text-gray-800">
                        {userProfile.full_name || "Not set"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Company Name</span>
                      <p className="text-lg font-semibold text-gray-800">
                        {userProfile.company_name || "Not set"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <span>{userProfile.phone || "Not set"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                        />
                      </svg>
                      <span>{userProfile.email || "Not set"}</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Company Description */}
              <section className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-semibold text-teal-600 mb-4">Company Description</h2>
                <p className="text-base text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-md">
                  {userProfile.company_description || "No company description provided."}
                </p>
              </section>

              {/* Company Details */}
              <section className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-semibold text-teal-600 mb-4">Company Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Industry</span>
                    <div className="flex items-center gap-2 text-gray-700 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a2 2 0 012-2h2a2 2 0 012 2v5m-4-10h1m-1 4h1"
                        />
                      </svg>
                      <span>{userProfile.industry || "Not set"}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Company Size</span>
                    <div className="flex items-center gap-2 text-gray-700 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                      <span>{userProfile.company_size || "Not set"}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Founded Year</span>
                    <div className="flex items-center gap-2 text-gray-700 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>{userProfile.founded_year || "Not set"}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Location</span>
                    <div className="flex items-center gap-2 text-gray-700 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span>{userProfile.location || "Not set"}</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Job Opportunities */}
              <section className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-semibold text-teal-600 mb-4">Job Opportunities</h2>
                <p className="text-base text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-md">
                  {userProfile.job_description || "No job opportunities described."}
                </p>
              </section>

              {/* Employee Benefits */}
              <section className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-semibold text-teal-600 mb-4">Employee Benefits</h2>
                <p className="text-base text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-md">
                  {userProfile.employee_benefits || "No benefits listed."}
                </p>
              </section>

              {/* Social Links */}
              <section className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-semibold text-teal-600 mb-4">Social Links</h2>
                <div className="space-y-2">
                  {userProfile.company_website ? (
                    <a href={userProfile.company_website} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline block">
                      Website
                    </a>
                  ) : (
                    <p className="text-gray-600">No website provided</p>
                  )}
                  {userProfile.linkedin ? (
                    <a href={userProfile.linkedin} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline block">
                      LinkedIn
                    </a>
                  ) : (
                    <p className="text-gray-600">No LinkedIn provided</p>
                  )}
                  {userProfile.twitter ? (
                    <a href={userProfile.twitter} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline block">
                      Twitter
                    </a>
                  ) : (
                    <p className="text-gray-600">No Twitter provided</p>
                  )}
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerProfile;