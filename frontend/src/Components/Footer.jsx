import facebook from '../images/facebook.png';
import twitter from '../images/twitter.png';
import linkedin from '../images/linkedin.png';
import { useNavigate } from 'react-router-dom';
export default function Footer() {
  const navigate=useNavigate();
  return (
    <footer className="relative bg-white text-gray-700 pt-12 mt-12 border-t border-teal-300 shadow-sm">
      {/* Decorative Wave Shape */}
      <div className="absolute -top-12 w-full">
        <svg className="w-full h-14 text-white" viewBox="0 0 1440 320" fill="currentColor">
          <path d="M0,192L48,202.7C96,213,192,235,288,218.7C384,203,480,149,576,122.7C672,96,768,96,864,128C960,160,1056,224,1152,245.3C1248,267,1344,245,1392,234.7L1440,224V320H0Z"></path>
        </svg>
      </div>

      {/* Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center sm:text-left relative z-10">
        
        {/* About JobFlare */}
        <div>
          <h2 className="text-xl font-bold text-teal-600 mb-3 tracking-tight">JobFlare</h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-xs mx-auto sm:mx-0">
            A smarter way to connect job seekers with top employers, ensuring a seamless hiring experience.
          </p>
        </div>

        {/* Job Seekers Section */}
        <div>
          <h2 className="text-lg font-semibold text-teal-600 mb-3">Job Seekers</h2>
          <ul className="space-y-2 text-sm sm:text-base">
            <li>
              <a href={navigate("/BrowseJobs")} className="text-gray-600 hover:text-teal-600 transition-colors duration-200">
                Search Jobs 
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-600 hover:text-teal-600 transition-colors duration-200">
                Create an Account
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-600 hover:text-teal-600 transition-colors duration-200">
                Job Alerts
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-600 hover:text-teal-600 transition-colors duration-200">
                Career Advice
              </a>
            </li>
          </ul>
        </div>

        {/* Employers Section */}
        <div>
          <h2 className="text-lg font-semibold text-teal-600 mb-3">For Employers</h2>
          <ul className="space-y-2 text-sm sm:text-base">
            <li>
              <a href="#" className="text-gray-600 hover:text-teal-600 transition-colors duration-200">
                Post a Job
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-600 hover:text-teal-600 transition-colors duration-200">
                Find Talent
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-600 hover:text-teal-600 transition-colors duration-200">
                Employer Dashboard
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-600 hover:text-teal-600 transition-colors duration-200">
                Recruiting Solutions
              </a>
            </li>
          </ul>
        </div>

        {/* Contact & Social Media */}
        <div>
          <h2 className="text-lg font-semibold text-teal-600 mb-3">Contact Us</h2>
          <ul className="space-y-2 text-sm sm:text-base text-gray-600">
            <li className="flex justify-center sm:justify-start items-center gap-2">
              <span className="text-teal-500">📍</span> 13 Fifth Ave, NY 10160
            </li>
            <li className="flex justify-center sm:justify-start items-center gap-2">
              <span className="text-teal-500">📞</span> +1 555-345-4599
            </li>
            <li className="flex justify-center sm:justify-start items-center gap-2">
              <span className="text-teal-500">📧</span> contact@jobflare.com
            </li>
          </ul>

          <div className="flex justify-center sm:justify-start space-x-3 mt-4">
            <a href="#" className="hover:scale-110 transition-transform duration-200">
              <img src={facebook} alt="Facebook" className="w-6 h-6 sm:w-7 sm:h-7" />
            </a>
            <a href="#" className="hover:scale-110 transition-transform duration-200">
              <img src={twitter} alt="Twitter" className="w-6 h-6 sm:w-7 sm:h-7" />
            </a>
            <a href="#" className="hover:scale-110 transition-transform duration-200">
              <img src={linkedin} alt="LinkedIn" className="w-6 h-6 sm:w-7 sm:h-7" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-teal-200 mt-10 pt-4 pb-6 text-center text-sm relative z-10 bg-teal-50">
        <p className="text-gray-600">© {new Date().getFullYear()} JobFlare. All rights reserved.</p>
        <div className="flex justify-center space-x-4 sm:space-x-6 mt-3">
          <a href="#" className="text-gray-600 hover:text-teal-600 transition-colors duration-200">
            Privacy Policy
          </a>
          <a href="#" className="text-gray-600 hover:text-teal-600 transition-colors duration-200">
            Terms of Service
          </a>
          <a href="#" className="text-gray-600 hover:text-teal-600 transition-colors duration-200">
            Cookie Policy
          </a>
        </div>
      </div>
    </footer>
  );
}