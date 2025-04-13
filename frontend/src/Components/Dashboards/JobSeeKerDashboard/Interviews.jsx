import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import BASE_URL from '../../API';

export const Interviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [responding, setResponding] = useState(null); // Track which interview is being responded to
  const authToken = localStorage.getItem('authToken');
  const userId = localStorage.getItem('user_Id');

  const fetchInterviews = useCallback(async () => {
 


    if (!authToken || !userId) {
      setError('Please log in to view your interviews.');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/jobs/my-interviews`, {
        params: { jobSeeker_id: userId },
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (Array.isArray(response.data)) {
        setInterviews(response.data);
        setError(null);
      } else {
        throw new Error('Invalid data format from server.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.details
        ? `${error.response.data.error}: ${error.response.data.details}`
        : error.response?.data?.error || 'Failed to load interviews.';
      setError(errorMessage);
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [authToken, userId]);

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  const handleResponse = async (interviewId, response) => {
 
    console.log('Sending request to confirm/reject:', {
      url: `${BASE_URL}/jobs/confirm-interview`,
      interviewId,
      response,
      authToken,
    });

    setResponding(interviewId);
    try {
      await axios.post(
        `${BASE_URL}/jobs/confirm-interview`,
        { interview_id: interviewId, response }, // "Confirmed" or "Declined"
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setInterviews((prev) =>
        prev.map((interview) =>
          interview.id === interviewId ? { ...interview, status: response } : interview
        )
      );
      toast.success(`Interview ${response.toLowerCase()} successfully!`, { duration: 3000 });
    } catch (error) {
      toast.error(error.response?.data?.error || `Failed to ${response.toLowerCase()} interview.`, {
        duration: 3000,
      });
      console.error('Response error:', error);
    } finally {
      setResponding(null);
    }
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
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md border border-gray-100">
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
    <div className="h-[150vh] w-full overflow-auto bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <Toaster />
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            My Interviews <span className="text-gray-500 text-lg">({interviews.length})</span>
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
            <p className="text-gray-600 text-base font-medium mb-4">No interviews scheduled yet.</p>
            <a
              href="/jobs"
              className="inline-block bg-teal-600 text-white px-5 py-2 rounded-full hover:bg-teal-700 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg"
            >
              Explore Jobs
            </a>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {interviews.map((interview) => (
              <div
                key={interview.id}
                className="bg-white border border-gray-200 rounded-lg shadow-md p-5 hover:shadow-lg hover:border-teal-400 transition-all duration-300 flex flex-col"
              >
                <div className="flex flex-col gap-3 mb-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-4">
                      {interview.companyLogo && (
                        <img
                          src={interview.companyLogo}
                          alt="Company Logo"
                          className="h-12 w-12 rounded-full object-cover border-2 border-teal-200 shadow-sm flex-shrink-0"
                        />
                      )}
                      <div className="flex flex-col">
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-teal-600 transition-colors duration-150">
                          {interview.jobTitle || 'Untitled Job'}
                        </h3>
                        <p className="text-sm text-gray-600">{interview.companyName || 'Unknown Company'}</p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
                        interview.status === 'Scheduled'
                          ? 'bg-purple-100 text-purple-800 border border-purple-300'
                          : interview.status === 'Confirmed'
                          ? 'bg-green-100 text-green-800 border border-green-300'
                          : 'bg-red-100 text-red-800 border border-red-300'
                      }`}
                    >
                      {interview.status === 'Scheduled' && '⏰ '}
                      {interview.status === 'Confirmed' && '✅ '}
                      {interview.status === 'Declined' && '❌ '}
                      {interview.status || 'Scheduled'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 text-sm text-gray-700">
                    <div className="flex items-center space-x-2">
                      <svg className="h-5 w-5 text-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Scheduled: {new Date(interview.interview_date).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="h-5 w-5 text-purple-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span>Type: {interview.interview_type}</span>
                    </div>
                    {interview.interview_location && (
                      <div className="flex items-center space-x-2">
                        <svg className="h-5 w-5 text-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Location: {interview.interview_location}</span>
                      </div>
                    )}
                    {interview.phone_number && (
                      <div className="flex items-center space-x-2">
                        <svg className="h-5 w-5 text-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>Phone: {interview.phone_number}</span>
                      </div>
                    )}
                    {interview.zoom_link && (
                      <div className="flex items-center space-x-2">
                        <svg className="h-5 w-5 text-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <a href={interview.zoom_link} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">
                          Join Zoom
                        </a>
                      </div>
                    )}
                    {interview.dress_code && (
                      <div className="flex items-center space-x-2">
                        <svg className="h-5 w-5 text-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9l-7-7-7 7v10a2 2 0 002 2z" />
                        </svg>
                        <span>Dress Code: {interview.dress_code}</span>
                      </div>
                    )}
                    {interview.document_url && (
                      <div className="flex items-center space-x-2">
                        <svg className="h-5 w-5 text-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <a href={interview.document_url} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">
                          View Document
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                {interview.status === 'Scheduled' && (
                  <div className="flex flex-col sm:flex-row justify-end gap-3">
                    <button
                      onClick={() => handleResponse(interview.id, 'Confirmed')}
                      className={`bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-1.5 rounded-full transition-all duration-200 flex items-center shadow-md hover:shadow-lg text-sm ${
                        responding === interview.id ? 'opacity-50 cursor-not-allowed' : 'hover:from-green-700 hover:to-green-800'
                      }`}
                      disabled={responding === interview.id}
                    >
                      {responding === interview.id ? (
                        <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : null}
                      Confirm
                    </button>
                    <button
                      onClick={() => handleResponse(interview.id, 'Declined')}
                      className={`bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-1.5 rounded-full transition-all duration-200 flex items-center shadow-md hover:shadow-lg text-sm ${
                        responding === interview.id ? 'opacity-50 cursor-not-allowed' : 'hover:from-red-700 hover:to-red-800'
                      }`}
                      disabled={responding === interview.id}
                    >
                      {responding === interview.id ? (
                        <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : null}
                      Decline
                    </button>
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