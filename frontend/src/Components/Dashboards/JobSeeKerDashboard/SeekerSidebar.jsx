 import PropTypes from 'prop-types'
 import { useState, useEffect } from 'react';
 import axios from 'axios';
 import { io } from 'socket.io-client';
 import toast, { Toaster } from 'react-hot-toast';
 import { SideContents } from '../SideContents';
 import {FaBars, FaTimes, FaSearch, FaCalendarAlt, FaBookmark, FaFileAlt, FaBell, FaEnvelope, FaUserCog, FaQuestionCircle, FaChartLine, FaUser, FaCreditCard } from 'react-icons/fa';
 import BASE_URL from '../../API';
 
 export const SeekerSidebar = ({ onSetActiveContent, activeContent }) => {
   const [user, setUser] = useState({ name: '', picture: null });
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const [interviewCount, setInterviewCount] = useState(0);
   const [interviewAlerts, setInterviewAlerts] = useState([]);
   const [showAlerts, setShowAlerts] = useState(false);
   const [messageCount, setMessageCount] = useState(0);
   const [error, setError] = useState(null);
   const authToken = localStorage.getItem('authToken');
   const userId = localStorage.getItem('user_Id');
   const userRole = localStorage.getItem('role');
 
   useEffect(() => {
     if (!authToken || !userId || !userRole) {
       setError('Authentication required. Please log in.');
       return;
     }
 
     const socket = io(BASE_URL, { auth: { token: authToken }, reconnectionAttempts: 5 });
 
     socket.on('connect', () => {
       const room = `${userRole}:${userId}`;
       socket.emit('join', room);
       console.log(`Connected to WebSocket as ${room}`);
     });
 
     socket.on('newMessage', (data) => {
       console.log('New message received:', data);
       if (data.receiver_id === parseInt(userId) && data.receiver_role === userRole && !data.is_read) {
         setMessageCount((prev) => {
           console.log('Incrementing message count:', prev + 1);
           return prev + 1;
         });
         toast.success(`New message from ${data.sender_name}: ${data.message}`);
       }
     });
 
     socket.on('messagesRead', (data) => {
       if (data.user_id === parseInt(userId) && data.user_role === userRole) {
         setMessageCount(0);
         console.log('All messages marked as read');
       }
     });
 
     socket.on('interviewScheduled', (data) => {
       setInterviewAlerts((prev) => [...prev, data]);
       setInterviewCount((prev) => prev + 1);
       toast.success(`Interview scheduled for ${data.jobTitle} on ${new Date(data.interview_date).toLocaleString()}!`);
     });
 
     socket.on('connect_error', (err) => {
       console.error('Socket connection error:', err.message);
     });
 
     return () => socket.disconnect();
   }, [authToken, userId, userRole]);
 
   useEffect(() => {
     const name = localStorage.getItem('name');
     const picture = localStorage.getItem('profile_picture_url');
     if (name) setUser({ name, picture });
 
     const fetchInitialData = async () => {
       if (!authToken) {
         setError('No authentication token found.');
         return;
       }
       try {
         const [countRes, alertsRes, unreadCountRes] = await Promise.all([
           axios.get(`${BASE_URL}/jobs/interviewCount`, { headers: { Authorization: `Bearer ${authToken}` } })
             .catch((err) => { throw new Error(`interviewCount failed: ${err.message}`); }),
           axios.get(`${BASE_URL}/jobs/interviewAlerts`, { headers: { Authorization: `Bearer ${authToken}` } })
             .catch((err) => { throw new Error(`interviewAlerts failed: ${err.message}`); }),
           axios.get(`${BASE_URL}/jobs/unreadMessageCount`, { headers: { Authorization: `Bearer ${authToken}` } })
             .catch((err) => { throw new Error(`unreadMessageCount failed: ${err.message}`); }),
         ]);
         console.log('API responses:', { countRes: countRes.data, alertsRes: alertsRes.data, unreadCountRes: unreadCountRes.data });
         setInterviewCount(countRes.data.count || 0);
         setInterviewAlerts(alertsRes.data || []);
         setMessageCount(unreadCountRes.data.count || 0);
       } catch (err) {
         console.error('Fetch error:', err.message);
         setError(`Failed to load data: ${err.message}`);
       }
     };
     fetchInitialData();
   }, [authToken, userId, userRole]);
 
   const handleItemClick = (key) => {
     if (key === 'jobAlerts') {
       setShowAlerts(!showAlerts);
     } else {
       onSetActiveContent(key);
       setIsSidebarOpen(false);
       setShowAlerts(false);
       if (key === 'messages') {
         setMessageCount(0);
         axios.post(
           `${BASE_URL}/jobs/markAllMessagesRead`,
           {},
           { headers: { Authorization: `Bearer ${authToken}` } }
         )
           .then((res) => console.log('Mark read response:', res.data))
           .catch((err) => console.error('Failed to mark messages read:', err.message));
       }
     }
   };
 
   const handleEditProfile = () => {
     onSetActiveContent('JobSeekerProfile');
     setIsSidebarOpen(false);
   };
 
   const jobSearchItems = [
     { key: 'SearchJobs', label: 'Find Jobs', icon: <FaSearch className="mr-3" /> },
     { key: 'SavedJobs', label: 'Saved Jobs', icon: <FaBookmark className="mr-3" /> },
     { key: 'Applications', label: 'My Applications', icon: <FaFileAlt className="mr-3" /> },
   ];
 
   const careerItems = [
     { key: 'SeekerSummary', label: 'Dashboard', icon: <FaChartLine className="mr-3" /> },
     { key: 'Interviews', label: 'Interviews', icon: <FaCalendarAlt className="mr-3" /> },
     {
       key: 'jobAlerts',
       label: 'Job Alerts',
       icon: (
         <div className="relative">
           <FaBell className="mr-3" />
           {interviewCount > 0 && (
             <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
               {interviewCount}
             </span>
           )}
         </div>
       ),
     },
     { key: 'Subscription', label: 'Subscription', icon: <FaCreditCard className="mr-3" /> },
   ];
 
   const accountItems = [
     { key: 'JobSeekerProfile', label: 'My Profile', icon: <FaUser className="mr-3" /> },
     {
       key: 'messages',
       label: 'Messages',
       icon: (
         <div className="relative">
           <FaEnvelope className="mr-3" />
           {messageCount > 0 && (
             <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
               {messageCount}
             </span>
           )}
         </div>
       ),
     },
     { key: 'settings', label: 'Account Settings', icon: <FaUserCog className="mr-3" /> },
     { key: 'helpSupport', label: 'Help Center', icon: <FaQuestionCircle className="mr-3" /> },
   ];
 
   return (
     <>
       <Toaster />
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
         {user.picture && (
           <div className="flex flex-col items-center mb-8">
             <div className="relative flex justify-center items-center w-full max-w-xs">
               <img
                 src={`${BASE_URL}${user.picture}`}
                 alt="Profile"
                 className="w-20 h-20 rounded-full border-2 border-teal-100 object-cover hover:scale-105 transition-transform duration-300 shadow-md"
               />
               <button onClick={handleEditProfile} className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full hover:bg-teal-50">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600 hover:text-teal-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                 </svg>
               </button>
             </div>
             <h1 className="text-gray-900 font-semibold text-lg mt-4 text-center">{user.name}</h1>
           </div>
         )}
         {error && <div className="mb-4 p-2 bg-red-100 text-red-700 text-sm rounded-lg">{error}</div>}
         <div className="space-y-4">
           <div>
             <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-4">Job Search</h3>
             {jobSearchItems.map((item) => (
               <SideContents
                 key={item.key}
                 onClick={() => handleItemClick(item.key)}
                 className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                   activeContent === item.key ? 'bg-teal-100 text-teal-800 font-medium' : 'hover:bg-teal-50 text-gray-800'
                 }`}
               >
                 {item.icon}
                 {item.label}
               </SideContents>
             ))}
           </div>
           <div>
             <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-4">Career Tools</h3>
             <div className="space-y-1 relative">
               {careerItems.map((item) => (
                 <div key={item.key}>
                   <SideContents
                     onClick={() => handleItemClick(item.key)}
                     className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                       activeContent === item.key ? 'bg-teal-100 text-teal-800 font-medium' : 'hover:bg-teal-50 text-gray-800'
                     }`}
                   >
                     {item.icon}
                     {item.label}
                   </SideContents>
                   {item.key === 'jobAlerts' && showAlerts && (
                     <div className="mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                       {interviewAlerts.length === 0 ? (
                         <div className="p-3 text-sm text-gray-600">No scheduled interviews.</div>
                       ) : (
                         interviewAlerts.map((alert) => (
                           <div
                             key={`${alert.job_id}-${alert.interview_date}`}
                             className="p-3 border-b border-gray-100 hover:bg-teal-50 cursor-pointer"
                             onClick={() => {
                               onSetActiveContent('Interviews');
                               setShowAlerts(false);
                               setIsSidebarOpen(false);
                             }}
                           >
                             <p className="text-sm font-medium text-gray-900 truncate">{alert.jobTitle}</p>
                             <p className="text-xs text-gray-600 truncate">{alert.companyName}</p>
                             <p className="text-xs text-purple-600">{new Date(alert.interview_date).toLocaleString()}</p>
                             <p className="text-xs text-teal-600">Type: {alert.interview_type}</p>
                             {alert.zoom_link && (
                               <p className="text-xs text-teal-600">
                                 Zoom: <a href={alert.zoom_link} target="_blank" rel="noopener noreferrer" className="underline">{alert.zoom_link}</a>
                               </p>
                             )}
                           </div>
                         ))
                       )}
                     </div>
                   )}
                 </div>
               ))}
             </div>
           </div>
           <div className="pt-4 border-t border-gray-200">
             <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-4">Account</h3>
             {accountItems.map((item) => (
               <SideContents
                 key={item.key}
                 onClick={() => handleItemClick(item.key)}
                 className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                   activeContent === item.key ? 'bg-teal-100 text-teal-800 font-medium' : 'hover:bg-teal-50 text-gray-800'
                 }`}
               >
                 {item.icon}
                 {item.label}
               </SideContents>
             ))}
           </div>
         </div>
       </aside>
     </>
   );
 };
SeekerSidebar.propTypes = {
  onSetActiveContent: PropTypes.func.isRequired,
  activeContent: PropTypes.string.isRequired,
};

