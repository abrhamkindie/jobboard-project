import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import io from 'socket.io-client';
import BASE_URL from '../../API';

export const EmployerInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedInterviewId, setExpandedInterviewId] = useState(null);
  const authToken = localStorage.getItem('authToken');
  const userId = localStorage.getItem('user_Id');
  const socketRef = useRef(null);

  const fetchInterviews = useCallback(async () => {
    if (!authToken || !userId) {
      setError('Please log in to view interviews.');
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(`${BASE_URL}/jobs/employer-interviews`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setInterviews(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to load interviews.');
      console.error('Fetch interviews error:', error);
    } finally {
      setLoading(false);
    }
  }, [authToken, userId]);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(BASE_URL, { auth: { token: authToken }, reconnectionAttempts: 5 });
      socketRef.current.on('connect', () => console.log('Socket connected:', socketRef.current.id));
      socketRef.current.on('connect_error', (err) => console.error('Socket error:', err));
      socketRef.current.on('interviewResponse', (data) => {
        setInterviews((prev) => {
          const updated = prev.map((interview) =>
            interview.interview_id === data.interview_id ? { ...interview, status: data.response } : interview
          );
          return [...updated];
        });
        toast.success(`Job seeker ${data.response.toLowerCase()} interview #${data.interview_id}`, { duration: 3000 });
      });
    }

    fetchInterviews();

    return () => {
      if (socketRef.current) {
        socketRef.current.off('interviewResponse');
        socketRef.current.off('connect');
        socketRef.current.off('connect_error');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [fetchInterviews,authToken]);

  const toggleProfile = (interviewId) => {
    setExpandedInterviewId(expandedInterviewId === interviewId ? null : interviewId);
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-md animate-pulse">
          <svg className="animate-spin h-6 w-6 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-gray-800 text-lg font-medium">Loading Interviews...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md border border-gray-200">
          <svg className="mx-auto h-10 w-10 text-red-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p className="text-red-600 text-base font-medium mb-4">{error}</p>
          <button
            onClick={fetchInterviews}
            className="bg-teal-600 text-white px-5 py-2 rounded-full hover:bg-teal-700 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[125vh] w-full overflow-auto bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <Toaster />
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Scheduled Interviews <span className="text-gray-500 text-lg">({interviews.length})</span>
          </h1>
          <button
            onClick={fetchInterviews}
            className="bg-teal-50 text-teal-700 px-4 py-1.5 rounded-full hover:bg-teal-100 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg"
          >
            Refresh
          </button>
        </header>

        {interviews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md border border-gray-200">
            <svg className="mx-auto h-10 w-10 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p className="text-gray-600 text-base font-medium">No interviews scheduled yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {interviews.map((interview) => (
              <div
                key={interview.interview_id}
                className="bg-white border border-gray-200 rounded-lg shadow-md p-5 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                  <div className="flex items-center gap-4">
                    {interview.jobSeekerProfilePicture ? (
                      <img
                        src={interview.jobSeekerProfilePicture}
                        alt={`${interview.jobSeekerName}'s profile`}
                        className="w-12 h-12 rounded-full object-cover border-2 border-teal-200"
                        onError={(e) => (e.target.src = 'https://via.placeholder.com/48?text=No+Image')}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-semibold text-lg">
                        {interview.jobSeekerName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{interview.jobTitle}</h3>
                      <p className="text-sm text-gray-600">{interview.companyName}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-700">Applicant: {interview.jobSeekerName}</p>
                        <button
                          onClick={() => toggleProfile(interview.interview_id)}
                          className="text-teal-600 hover:text-teal-800 text-sm font-medium transition-colors duration-200"
                        >
                          {expandedInterviewId === interview.interview_id ? 'Hide Profile' : 'View Profile'}
                        </button>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
                      interview.status === 'Scheduled'
                        ? 'bg-purple-100 text-purple-800 border border-purple-300'
                        : interview.status === 'Confirmed'
                        ? 'bg-green-100 text-green-800 border border-green-300'
                        : interview.status === 'Declined'
                        ? 'bg-red-100 text-red-800 border border-red-300'
                        : interview.status === 'Completed'
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : interview.status === 'Cancelled'
                        ? 'bg-gray-100 text-gray-800 border border-gray-300'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {interview.status === 'Scheduled' && '⏰ '}
                    {interview.status === 'Confirmed' && '✅ '}
                    {interview.status === 'Declined' && '❌ '}
                    {interview.status === 'Completed' && '🏁 '}
                    {interview.status === 'Cancelled' && '🚫 '}
                    {interview.status}
                  </span>
                </div>
                <div className="text-sm text-gray-700">
                  <p>Date: {new Date(interview.interview_date).toLocaleString()}</p>
                  <p>Type: {interview.interview_type}</p>
                  {interview.interview_location && <p>Location: {interview.interview_location}</p>}
                  {interview.phone_number && <p>Phone: {interview.phone_number}</p>}
                  {interview.zoom_link && (
                    <p>
                      <a href={interview.zoom_link} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">
                        Zoom Link
                      </a>
                    </p>
                  )}
                  {interview.dress_code && <p>Dress Code: {interview.dress_code}</p>}
                  {interview.document_url && (
                    <p>
                      <a href={interview.document_url} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">
                        Document
                      </a>
                    </p>
                  )}
                </div>

                {/* Job Seeker Profile */}
                {expandedInterviewId === interview.interview_id && (
                  <div className="mt-4 p-4 bg-teal-50 rounded-lg border border-teal-200 shadow-sm">
                    <div className="flex items-center gap-4 mb-3">
                      {interview.jobSeekerProfilePicture ? (
                        <img
                          src={interview.jobSeekerProfilePicture}
                          alt={`${interview.jobSeekerName}'s profile`}
                          className="w-16 h-16 rounded-full object-cover border-2 border-teal-200"
                          onError={(e) => (e.target.src = 'https://via.placeholder.com/64?text=No+Image')}
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-semibold text-xl">
                          {interview.jobSeekerName.charAt(0)}
                        </div>
                      )}
                      <h4 className="text-lg font-semibold text-teal-900">Applicant Profile: {interview.jobSeekerName}</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800">
                      <div>
                        <p><strong>Email:</strong> {interview.jobSeekerEmail || 'N/A'}</p>
                        {interview.jobSeekerPhone && <p><strong>Phone:</strong> {interview.jobSeekerPhone}</p>}
                        {interview.jobSeekerBio && <p><strong>Bio:</strong> {interview.jobSeekerBio}</p>}
                        {interview.jobSeekerAvailability && (
                          <p><strong>Availability:</strong> {interview.jobSeekerAvailability}</p>
                        )}
                      </div>
                      <div>
                        {interview.jobSeekerSkills && (
                          <p><strong>Skills:</strong> {interview.jobSeekerSkills.split(',').join(', ')}</p>
                        )}
                        {interview.jobSeekerEducation && (
                          <p><strong>Education:</strong> {interview.jobSeekerEducation}</p>
                        )}
                        {interview.jobSeekerExperience && (
                          <p><strong>Experience:</strong> {interview.jobSeekerExperience}</p>
                        )}
                        {interview.jobSeekerCertifications && (
                          <p><strong>Certifications:</strong> {interview.jobSeekerCertifications}</p>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 space-y-2">
                      {interview.jobSeekerLinkedIn && (
                        <p>
                          <strong>LinkedIn:</strong>{' '}
                          <a href={interview.jobSeekerLinkedIn} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">
                            {interview.jobSeekerLinkedIn}
                          </a>
                        </p>
                      )}
                      {interview.jobSeekerGitHub && (
                        <p>
                          <strong>GitHub:</strong>{' '}
                          <a href={interview.jobSeekerGitHub} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">
                            {interview.jobSeekerGitHub}
                          </a>
                        </p>
                      )}
                      {interview.jobSeekerResume && (
                        <p>
                          <strong>Resume:</strong>{' '}
                          <a href={interview.jobSeekerResume} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">
                            View Resume
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};