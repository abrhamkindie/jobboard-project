import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import BASE_URL from "./API";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [company_logo, setCompany_logo] = useState(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // New state for mobile menu

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userRole = localStorage.getItem("role");
    const userProfilePicture = localStorage.getItem("profile_picture_url");
    const userCompany_logo = localStorage.getItem("companyLogo");

    if (token && userRole) {
      setIsLoggedIn(true);
      setRole(userRole);
      setProfilePicture(userProfilePicture);
      setCompany_logo(userCompany_logo);
    }

    const handleAuthChange = () => {
      const updatedToken = localStorage.getItem("authToken");
      const updatedRole = localStorage.getItem("role");
      const updatedProfilePicture = localStorage.getItem("profile_picture_url");
      const updatedCompany_logo = localStorage.getItem("companyLogo");

      if (updatedToken) {
        setIsLoggedIn(true);
        setRole(updatedRole);
        setProfilePicture(updatedProfilePicture);
        setCompany_logo(updatedCompany_logo);
      } else {
        setIsLoggedIn(false);
        setRole(null);
        setProfilePicture(null);
        setCompany_logo(null);
      }
    };

    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsHeaderVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsHeaderVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    localStorage.removeItem("profile_picture_url");
    localStorage.removeItem("companyLogo");

    setIsLoggedIn(false);
    setRole(null);
    setProfilePicture(null);
    setCompany_logo(null);

    window.dispatchEvent(new Event("authChange"));
    navigate("/login");
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      className={`w-full bg-white border-b border-teal-200 shadow-lg py-3 sticky top-0 z-20 transition-transform duration-300 ease-in-out ${
        isHeaderVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <NavLink
          to="/"
          className="text-2xl sm:text-3xl font-extrabold text-teal-600 hover:text-teal-700 transition duration-200 tracking-tight"
        >
          JobFlare
        </NavLink>

        {/* Hamburger Button for Mobile */}
        <button
          className="lg:hidden text-teal-600 text-2xl focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>

        {/* Navigation Links */}
        <nav
          className={`${
            isMenuOpen ? "block" : "hidden"
          } lg:flex lg:items-center absolute lg:static top-16 left-0 w-full lg:w-auto bg-white lg:bg-transparent shadow-lg lg:shadow-none transition-all duration-300 ease-in-out z-10`}
        >
          <ul className="flex flex-col lg:flex-row lg:space-x-4 p-4 lg:p-0 space-y-3 lg:space-y-0">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition duration-200 ${
                    isActive
                      ? "bg-teal-100 text-teal-800"
                      : "text-gray-700 hover:bg-teal-50 hover:text-teal-600"
                  }`
                }
                onClick={() => setIsMenuOpen(false)} // Close menu on click
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/BrowseJobs"
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition duration-200 ${
                    isActive
                      ? "bg-teal-100 text-teal-800"
                      : "text-gray-700 hover:bg-teal-50 hover:text-teal-600"
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Browse Jobs
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/Employers"
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition duration-200 ${
                    isActive
                      ? "bg-teal-100 text-teal-800"
                      : "text-gray-700 hover:bg-teal-50 hover:text-teal-600"
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Employers
              </NavLink>
            </li>

            {!isLoggedIn && (
              <>
                <li>
                  <NavLink
                    to="/SignUp"
                    className="block px-4 py-2 rounded-lg text-sm sm:text-base font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/Login"
                    className="block px-4 py-2 rounded-lg text-sm sm:text-base font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </NavLink>
                </li>
              </>
            )}

            {isLoggedIn && role === "seeker" && (
              <>
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 rounded-lg text-sm sm:text-base font-medium text-red-600 hover:bg-red-50 transition duration-200"
                  >
                    Logout
                  </button>
                </li>
                <li>
                  <NavLink
                    to="/JobSeekerDash"
                    className="flex items-center px-4 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {profilePicture && (
                      <img
                        src={`${BASE_URL}${profilePicture}`}
                        alt="Profile"
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-teal-300 hover:border-teal-400 transition transform hover:scale-110"
                      />
                    )}
                  </NavLink>
                </li>
              </>
            )}

            {isLoggedIn && role === "employer" && (
              <>
                <li>
                  <NavLink
                    to="/JobPosting"
                    className="block px-4 py-2 rounded-lg text-sm sm:text-base font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Post a Job
                  </NavLink>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 rounded-lg text-sm sm:text-base font-medium text-red-600 hover:bg-red-50 transition duration-200"
                  >
                    Logout
                  </button>
                </li>
                <li>
                  <NavLink
                    to="/EmpDash"
                    className="flex items-center px-4 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {company_logo && (
                      <img
                        src={`${BASE_URL}${company_logo}`}
                        alt="Company Logo"
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-teal-300 hover:border-teal-400 transition transform hover:scale-110"
                      />
                    )}
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}