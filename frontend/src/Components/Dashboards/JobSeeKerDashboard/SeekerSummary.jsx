import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import EmpCard from '../../Cards/EmpCard.jsx';
import Button from '../Button.jsx';

export const SeekerSummary = ({ onSetActiveContent }) => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const storedUserName = localStorage.getItem('name') || 'Job Seeker';
    setUserName(storedUserName);
  }, []);

  // Realistic summary data
  const summaryData = {
    totalApplications: 42,
    interviewsScheduled: 8,
    offersReceived: 3,
    responseRate: 65, // Percentage
  };

  const handleViewDetails = (section) => {
    onSetActiveContent(section);
  };

  // Realistic card data
  const cards = [
    {
      id: 1,
      title: 'Application Progress',
      record1: `Submitted: ${summaryData.totalApplications}`,
      record2: 'Under Review: 15',
      record3: 'Awaiting Response: 19',
      onViewDetails: () => handleViewDetails('Applications'),
      highlightColor: 'text-teal-600',
    },
    {
      id: 2,
      title: 'Interview Pipeline',
      record1: `Scheduled: ${summaryData.interviewsScheduled}`,
      record2: 'Upcoming: 4',
      record3: 'Completed: 3',
      onViewDetails: () => handleViewDetails('Interviews'),
      highlightColor: 'text-indigo-600',
    },
    {
      id: 3,
      title: 'Job Offers',
      record1: `Received: ${summaryData.offersReceived}`,
      record2: 'Pending Decision: 2',
      record3: 'Accepted: 1',
      onViewDetails: () => handleViewDetails('Offers'),
      highlightColor: 'text-green-600',
    },
    {
      id: 4,
      title: 'Engagement',
      record1: 'Profile Views: 87',
      record2: 'Employer Messages: 5',
      record3: 'Saved Jobs: 12',
      onViewDetails: () => handleViewDetails('Activity'),
      highlightColor: 'text-orange-600',
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col border border-gray-200 rounded-xl shadow-md px-4 sm:px-6 md:px-8 py-4 sm:py-6 my-4 sm:my-8 bg-gray-50 hover:shadow-lg transition-shadow duration-300">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full mb-6 sm:mb-8 gap-4">
        <h1 className="text-gray-900 text-xl sm:text-2xl md:text-3xl font-bold">
          Welcome back, <span className="text-teal-600 italic">{userName}</span>!
        </h1>
        <Button
          onClick={() => onSetActiveContent('SearchJobs')}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-1 sm:px-6 sm:py-2 rounded-md transition-colors duration-300 font-medium text-sm sm:text-base"
        >
          Find New Opportunities
        </Button>
      </div>

      {/* Summary Section */}
      <div className="w-full mb-6 sm:mb-10 bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-teal-800 text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4">Your Job Search Overview</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-6 text-gray-700">
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-600">Applications Sent</p>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-teal-600">{summaryData.totalApplications}</p>
          </div>
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-600">Interviews Scheduled</p>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-teal-600">{summaryData.interviewsScheduled}</p>
          </div>
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-600">Offers Received</p>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-teal-600">{summaryData.offersReceived}</p>
          </div>
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-600">Response Rate</p>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-teal-600">{summaryData.responseRate}%</p>
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
        {cards.map((card) => (
          <EmpCard
            key={card.id}
            title={card.title}
            record1={card.record1}
            record2={card.record2}
            record3={card.record3}
            onViewDetails={card.onViewDetails}
            highlightColor={card.highlightColor}
          />
        ))}
      </div>
    </div>
  );
};

SeekerSummary.propTypes = {
  onSetActiveContent: PropTypes.func.isRequired,
};