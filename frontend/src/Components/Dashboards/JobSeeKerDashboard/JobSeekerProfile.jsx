import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../API";
import Button from "../Button";

 

const JobSeekerProfile = () => {
  const [userProfile, setUserProfile] = useState({});
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    job_title: "",
    skills: "",
    experience_level: "",
    location_preference: "",
    resume: "",
    profile: "",
    education: "",
    work_experience: "",
    bio: "",
    certifications: "",
    linkedin: "",
    github: "",
    availability: "",
  });
  const [profileFile, setProfileFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


 
  const navigate = useNavigate();
   const jobSeekerId = localStorage.getItem("user_Id");
  const authToken = localStorage.getItem("authToken");
  

  const getDriveImageUrl = (url) => {
    if (!url || !url.includes("drive.google.com")) return null;
    const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    return fileIdMatch ? `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}` : null;
  };

  useEffect(() => {
    if (!authToken || !jobSeekerId) {
      alert("You are not logged in. Redirecting to login page...");
      navigate("/login");
      return;
    }

    axios
      .get(`${BASE_URL}/profile/seeker_profile`, {
        params: { user_id: jobSeekerId },
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((response) => {
        const data = response.data;
         setUserProfile(data);
        setProfile({
          full_name: data.full_name || "",
          email: data.email || "",
          phone: data.phone || "",
          job_title: data.job_title || "",
          skills: data.skills || "",
          experience_level: data.experience_level || "",
          location_preference: data.location_preference || "",
          resume: data.resume || "",
          profile: data.profile || "",
          education: data.education || "",
          work_experience: data.work_experience || "",
          bio: data.bio || "",
          certifications: data.certifications || "",
          linkedin: data.linkedin || "",
          github: data.github || "",
          availability: data.availability || "",
        });
         localStorage.setItem("profile_picture_url", data.profile || "");
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching job seeker profile:", error);
        setError("Failed to load profile. Please try again.");
        setLoading(false);
      });
  }, [jobSeekerId, authToken, navigate,profile.profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileFileChange = (e) => {
    setProfileFile(e.target.files[0]);
  };

  const handleResumeFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("full_name", profile.full_name);
    formData.append("email", profile.email);
    formData.append("phone", profile.phone);
    formData.append("job_title", profile.job_title);
    formData.append("skills", profile.skills);
    formData.append("experience_level", profile.experience_level);
    formData.append("location_preference", profile.location_preference);
    formData.append("education", profile.education);
    formData.append("work_experience", profile.work_experience);
    formData.append("bio", profile.bio);
    formData.append("certifications", profile.certifications);
    formData.append("linkedin", profile.linkedin);
    formData.append("github", profile.github);
    formData.append("availability", profile.availability);
    formData.append("job_seeker_id", jobSeekerId);
    if (profileFile) formData.append("profile", profileFile);
    if (resumeFile) formData.append("resume", resumeFile);

    console.log('Sending FormData:', [...formData.entries()]);

    axios
      .post(`${BASE_URL}/profile/update_seeker_profile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((res) => {
        console.log('Update Response:', res.data);
        const updatedProfilePic = res.data.profile || profile.profile;
        const updatedResume = res.data.resume || profile.resume;
        setUserProfile({
          ...userProfile,
          ...profile,
          profile: updatedProfilePic,
          resume: updatedResume,
        });
        localStorage.setItem("profile_picture_url", updatedProfilePic);
        alert("✅ " + res.data.message);
        setProfile((prev) => ({
          ...prev,
          profile: updatedProfilePic,
          resume: updatedResume,
        }));
        setIsEditing(false);
        setProfileFile(null);
        setResumeFile(null);
      })
      .catch((err) => {
        console.error("Update Error:", err.response?.data || err.message);
        alert("❌ Failed to update profile: " + (err.response?.data?.error || "Unknown error"));
      });
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setProfileFile(null);
    setResumeFile(null);
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
            <h1 className="text-3xl font-bold text-teal-700">Job Seeker Profile</h1>
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
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
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
                  <label className="block text-sm font-medium text-gray-700">Desired Job Title</label>
                  <input
                    type="text"
                    name="job_title"
                    value={profile.job_title}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Experience Level</label>
                  <select
                    name="experience_level"
                    value={profile.experience_level}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  >
                    <option value="">Select Level</option>
                    <option value="Entry-level">Entry-level</option>
                    <option value="Mid-level">Mid-level</option>
                    <option value="Senior">Senior</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location Preference</label>
                  <input
                    type="text"
                    name="location_preference"
                    value={profile.location_preference}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
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
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">GitHub</label>
                  <input
                    type="url"
                    name="github"
                    value={profile.github}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="https://github.com/username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Availability</label>
                  <select
                    name="availability"
                    value={profile.availability}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select Availability</option>
                    <option value="Immediately">Immediately</option>
                    <option value="1 Week">1 Week</option>
                    <option value="2 Weeks">2 Weeks</option>
                    <option value="1 Month">1 Month</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
                <textarea
                  name="skills"
                  value={profile.skills}
                  onChange={handleChange}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  rows="3"
                  placeholder="e.g., JavaScript, Python, Project Management"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Education</label>
                <textarea
                  name="education"
                  value={profile.education}
                  onChange={handleChange}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  rows="3"
                  placeholder="e.g., BS Computer Science, XYZ University, 2020"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Work Experience</label>
                <textarea
                  name="work_experience"
                  value={profile.work_experience}
                  onChange={handleChange}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  rows="5"
                  placeholder="e.g., Software Engineer, ABC Corp, 2018-2022"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">About Me</label>
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  rows="3"
                  placeholder="e.g., Passionate developer with a focus on web technologies."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Certifications</label>
                <textarea
                  name="certifications"
                  value={profile.certifications}
                  onChange={handleChange}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  rows="3"
                  placeholder="e.g., AWS Certified Developer, Google Data Analytics"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                <input
                  type="file"
                  name="profile"
                  accept="image/*"
                  onChange={handleProfileFileChange}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                />
                {profile.profile && !profileFile && (
                  <p className="mt-2 text-sm text-gray-600">Current: {profile.profile}</p>
                )}
                {profileFile && (
                  <p className="mt-2 text-sm text-gray-600">New file selected: {profileFile.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Resume</label>
                <input
                  type="file"
                  name="resume"
                  accept="application/pdf"
                  onChange={handleResumeFileChange}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                />
                {profile.resume && !resumeFile && (
                  <p className="mt-2 text-sm text-gray-600">Current: {profile.resume}</p>
                )}
                {resumeFile && (
                  <p className="mt-2 text-sm text-gray-600">New file selected: {resumeFile.name}</p>
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
                    src={getDriveImageUrl(profile.profile) || "/default-profile.jpg"}
                    alt="Profile Picture"
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-teal-200 shadow-md"
                    onError={(e) => {
                    console.warn("JobSeekerProfile - Image load error:", profile.profile);
                    e.target.src = "/default-profile.jpg";
                    }}
                    />
                <p className="">
                getDriveImageUrl   {getDriveImageUrl(profile.profile) ? getDriveImageUrl(profile.profile):"nop"};

                </p>
                  <div className="flex-1 space-y-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Full Name</span>
                      <p className="text-lg font-semibold text-gray-800">
                        {userProfile.full_name || "Not set"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Desired Job Title</span>
                      <p className="text-lg font-semibold text-gray-800">
                        {userProfile.job_title || "Not set"}
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

              {/* About Me */}
              <section className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-semibold text-teal-600 mb-4">About Me</h2>
                <p className="text-base text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-md">
                  {userProfile.bio || "No bio provided."}
                </p>
              </section>

              {/* Career Preferences */}
              <section className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-semibold text-teal-600 mb-4">Career Preferences</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Location Preference</span>
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
                      <span>{userProfile.location_preference || "Not set"}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Experience Level</span>
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
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                      <span>{userProfile.experience_level || "Not set"}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Availability</span>
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
                      <span>{userProfile.availability || "Not set"}</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Skills */}
              <section className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-semibold text-teal-600 mb-4">Skills & Expertise</h2>
                <div className="flex flex-wrap gap-2">
                  {userProfile.skills ? (
                    userProfile.skills.split(",").map((skill, index) => (
                      <span
                        key={index}
                        className="inline-block bg-teal-100 text-teal-800 rounded-full px-3 py-1 text-sm font-medium"
                      >
                        {skill.trim()}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-600">No skills listed</p>
                  )}
                </div>
              </section>

              {/* Education */}
              <section className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-semibold text-teal-600 mb-4">Education</h2>
                <p className="text-base text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-md">
                  {userProfile.education || "No education details provided."}
                </p>
              </section>

              {/* Work Experience */}
              <section className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-semibold text-teal-600 mb-4">Work Experience</h2>
                <p className="text-base text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-md">
                  {userProfile.work_experience || "No work experience provided."}
                </p>
              </section>

              {/* Certifications */}
              <section className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-semibold text-teal-600 mb-4">Certifications</h2>
                <div className="flex flex-wrap gap-2">
                  {userProfile.certifications ? (
                    userProfile.certifications.split(",").map((cert, index) => (
                      <span
                        key={index}
                        className="inline-block bg-teal-100 text-teal-800 rounded-full px-3 py-1 text-sm font-medium"
                      >
                        {cert.trim()}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-600">No certifications listed</p>
                  )}
                </div>
              </section>

              {/* Social Links */}
              <section className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-semibold text-teal-600 mb-4">Social Links</h2>
                <div className="space-y-2">
                  {userProfile.linkedin ? (
                    <a href={userProfile.linkedin} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline block">
                      LinkedIn
                    </a>
                  ) : (
                    <p className="text-gray-600">No LinkedIn provided</p>
                  )}
                  {userProfile.github ? (
                    <a href={userProfile.github} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline block">
                      GitHub
                    </a>
                  ) : (
                    <p className="text-gray-600">No GitHub provided</p>
                  )}
                </div>
              </section>

              {/* Resume */}
              <section>
                <h2 className="text-xl font-semibold text-teal-600 mb-4">Resume</h2>
                <div className="bg-gray-50 p-4 rounded-md">
                  {userProfile.resume ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span className="text-gray-700">Resume File</span>
                      </div>
                      <a
                        href={`${BASE_URL}${userProfile.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-600 hover:underline flex items-center gap-1"
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
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        <span>Download</span>
                      </a>
                    </div>
                  ) : (
                    <p className="text-gray-600">No resume uploaded</p>
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

export default JobSeekerProfile;