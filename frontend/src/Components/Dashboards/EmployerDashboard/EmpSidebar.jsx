import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { SideContents } from '../SideContents';
import {
  FaBars,
  FaTimes,
  FaUsers,
  FaBell,
  FaUserCog,
  FaCalendarAlt,
  FaChartBar,
  FaBookmark,
  FaPlusCircle,
  FaListAlt,
  FaCreditCard,
  FaQuestionCircle,
} from 'react-icons/fa';
import BASE_URL from '../../API';

export const EmpSidebar = ({ onSetActiveContent, activeContent }) => {
  const [companyName, setCompanyName] = useState('');
  const [companyLogo, setCompanyLogo] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [interviewCount, setInterviewCount] = useState(0);
  const [applicationCount, setApplicationCount] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const authToken = localStorage.getItem('authToken');
  const employerId = localStorage.getItem('employer_id');
  //const userRole = 'employer';
  const userRole = localStorage.getItem('role') || 'employer';

  // WebSocket setup
  useEffect(() => {
    if (!authToken || !employerId) {
      setError('Authentication required. Please log in.');
      return;
    }

    const socket = io(BASE_URL, { auth: { token: authToken }, reconnectionAttempts: 5 });

    socket.on('connect', () => {
      const room = `${userRole}:${employerId}`;
      socket.emit('join', room);
      console.log(`Connected to WebSocket as ${room}`);
    });

    socket.on('newMessage', (data) => {
      if (data.receiver_id === parseInt(employerId) && data.receiver_role === userRole && !data.is_read) {
        setMessageCount((prev) => prev + 1);
        toast.success(`New message from ${data.sender_name}: ${data.message}`, { duration: 5000 });
      }
    });

    socket.on('newApplication', (data) => {
      setApplicationCount((prev) => prev + 1);
      toast.success(`New application for ${data.jobTitle} from ${data.applicantName}`, {
        duration: 5000,
        onClick: () => onSetActiveContent('manageApplications'),
      });
    });

    socket.on('interviewResponse', (data) => {
      if (data.response === 'Confirmed') {
        setInterviewCount((prev) => prev + 1);
        toast.success(`Interview confirmed for ${data.jobTitle} by Job Seeker ${data.jobseeker_id}`, {
          duration: 5000,
          onClick: () => onSetActiveContent('Interviews'),
        });
      } else if (data.response === 'Declined') {
        setInterviewCount((prev) => Math.max(0, prev - 1));
        toast.error(`Interview declined for ${data.jobTitle} by Job Seeker ${data.jobseeker_id}`, {
          duration: 5000,
          onClick: () => onSetActiveContent('Interviews'),
        });
      }
    });

    socket.on('messagesRead', (data) => {
      if (data.user_id === parseInt(employerId) && data.user_role === userRole) {
        setMessageCount(0);
        console.log('Messages marked as read');
      }
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
      setError('Failed to connect to notifications.');
    });

    return () => socket.disconnect();
  }, [authToken, employerId, userRole, onSetActiveContent]);

  // Fetch initial counts
  useEffect(() => {
    const company_Name = localStorage.getItem('name');
    const companyLogo = localStorage.getItem('companyLogo');
    if (company_Name) {
      setCompanyName(company_Name);
      setCompanyLogo(companyLogo);
    }

    const fetchInitialData = async () => {
      if (!authToken) {
        setError('No authentication token found.');
        return;
      }
      setLoading(true);
      try {
        const [messageRes, interviewRes, applicationRes] = await Promise.all([
          axios.get(`${BASE_URL}/jobs/unreadMessageCount`, {
            headers: { Authorization: `Bearer ${authToken}` },
          }).catch(() => ({ data: { count: 0 } })),
          axios.get(`${BASE_URL}/jobs/employerInterviewCount`, {
            headers: { Authorization: `Bearer ${authToken}` },
          }).catch(() => ({ data: { count: 0 } })),
          axios.get(`${BASE_URL}/jobs/employerApplicationCount`, {
            headers: { Authorization: `Bearer ${authToken}` },
          }).catch(() => ({ data: { count: 0 } })),
        ]);

        setMessageCount(messageRes.data.count || 0);
        setInterviewCount(interviewRes.data.count || 0);
        setApplicationCount(applicationRes.data.count || 0);
      } catch (err) {
        console.error('Fetch error:', err.message);
        setError('Failed to load notification counts.');
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [authToken]);

  const handleItemClick = (key) => {
    onSetActiveContent(key);
    setIsSidebarOpen(false);


    if (key === 'Messages') {
      setMessageCount(0);
      axios
        .post(`${BASE_URL}/jobs/markAllMessagesRead`, {}, { headers: { Authorization: `Bearer ${authToken}` } })
        .then(() =>  {
          setMessageCount(0);
        console.log('Messages marked as read via API');
        toast.success('Messages marked as read');
        })
        .catch((err) => {
          console.error('Mark read error:', err.message);
          setError('Failed to mark messages as read.');
          toast.error('Failed to mark messages as read');
        });
    }

    if (key === 'Interviews') {
      setInterviewCount(0); // Optional: Reset on view
    }
    if (key === 'manageApplications') {
      setApplicationCount(0); // Optional: Reset on view
    }
  };


  const handleEditProfile = () => {
    onSetActiveContent('EmployerProfile');
    setIsSidebarOpen(false);
  };

  const jobItems = [
    { key: 'JobPosting', label: 'Post New Job', icon: <FaPlusCircle className="mr-3" /> },
    { key: 'ManagePosts', label: 'Manage Jobs', icon: <FaListAlt className="mr-3" /> },
    {
      key: 'Interviews',
      label: 'Interviews',
      icon: (
        <div className="relative">
          <FaCalendarAlt className="mr-3" />
          {interviewCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {interviewCount}
            </span>
          )}
        </div>
      ),
    },
  ];

  const talentItems = [
    {
      key: 'manageApplications',
      label: 'Applications',
      icon: (
        <div className="relative">
          <FaUsers className="mr-3" />
          {applicationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {applicationCount}
            </span>
          )}
        </div>
      ),
    },
    { key: 'savedTalentPool', label: 'Talent Pool', icon: <FaBookmark className="mr-3" /> },
  ];

  const analyticsItems = [
    { key: 'jobAnalytics', label: 'Job Performance', icon: <FaChartBar className="mr-3" /> },
  ];

  const primaryItems = [
    {
      key: 'Messages',
      label: 'Messages',
      icon: (
        <div className="relative">
          <FaBell className="mr-3" />
          {messageCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {messageCount}
            </span>
          )}
        </div>
      ),
    },
    { key: 'billing', label: 'Billing & Payments', icon: <FaCreditCard className="mr-3" /> },
  ];

  const settingsItems = [
    { key: 'EmployerProfile', label: 'Company Profile', icon: <FaUserCog className="mr-3" /> },
    { key: 'helpSupport', label: 'Help & Support', icon: <FaQuestionCircle className="mr-3" /> },
  ];

  return (
    <>
      <Toaster position="top-right" />
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 p-3 bg-teal-600 text-white rounded-lg lg:hidden hover:bg-teal-700 transition-colors shadow-md"
      >
        {isSidebarOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
      </button>
      <aside
        className={`fixed lg:relative w-72 h-full bg-gray-50 px-4 py-6 transform transition-transform duration-300 ease-in-out border-r border-gray-200 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 z-0 shadow-sm`}
      >
        {companyLogo && (
          <div className="flex flex-col items-center mb-8">
            <div className="relative flex justify-center items-center w-full max-w-xs">
              <img
                src={`${BASE_URL}${companyLogo}`}
                alt="Company Logo"
                className="w-20 h-20 rounded-full border-2 border-teal-100 object-cover hover:scale-105 transition-transform duration-300 shadow-md"
              />
              <button
                onClick={handleEditProfile}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full hover:bg-teal-50 transition-colors duration-300"
                aria-label="Edit company profile"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-teal-600 hover:text-teal-800"
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
              </button>
            </div>
            <h1 className="text-gray-900 font-semibold text-lg mt-4 text-center">{companyName}</h1>
          </div>
        )}
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 text-sm rounded-lg animate-fade-in">{error}</div>
        )}
        {loading && (
          <div className="mb-4 p-2 bg-teal-100 text-teal-700 text-sm rounded-lg flex items-center gap-2 animate-fade-in">
            <FaBars className="animate-spin" />
            Loading notifications...
          </div>
        )}
        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-4">
              Job Management
            </h3>
            <div className="space-y-1">
              {jobItems.map((item) => (
                <SideContents
                  key={item.key}
                  onClick={() => handleItemClick(item.key)}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                    activeContent === item.key
                      ? 'bg-teal-100 text-teal-800 font-medium'
                      : 'hover:bg-teal-50 text-gray-800'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </SideContents>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-4">
              Talent Management
            </h3>
            <div className="space-y-1">
              {talentItems.map((item) => (
                <SideContents
                  key={item.key}
                  onClick={() => handleItemClick(item.key)}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                    activeContent === item.key
                      ? 'bg-teal-100 text-teal-800 font-medium'
                      : 'hover:bg-teal-50 text-gray-800'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </SideContents>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-4">
              Analytics
            </h3>
            <div className="space-y-1">
              {analyticsItems.map((item) => (
                <SideContents
                  key={item.key}
                  onClick={() => handleItemClick(item.key)}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                    activeContent === item.key
                      ? 'bg-teal-100 text-teal-800 font-medium'
                      : 'hover:bg-teal-50 text-gray-800'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </SideContents>
              ))}
            </div>
          </div>
          <div className="space-y-1">
            {primaryItems.map((item) => (
              <SideContents
                key={item.key}
                onClick={() => handleItemClick(item.key)}
                className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                  activeContent === item.key
                    ? 'bg-teal-100 text-teal-800 font-medium'
                    : 'hover:bg-teal-50 text-gray-800'
                }`}
              >
                {item.icon}
                {item.label}
              </SideContents>
            ))}
          </div>
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-4">
              Settings
            </h3>
            <div className="space-y-1">
              {settingsItems.map((item) => (
                <SideContents
                  key={item.key}
                  onClick={() => handleItemClick(item.key)}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                    activeContent === item.key
                      ? 'bg-teal-100 text-teal-800 font-medium'
                      : 'hover:bg-teal-50 text-gray-800'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </SideContents>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

EmpSidebar.propTypes = {
  onSetActiveContent: PropTypes.func.isRequired,
  activeContent: PropTypes.string.isRequired,
};