import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import EmpCard from '../../Cards/EmpCard.jsx';
import Button from '../Button.jsx';

export const EmpSummary = ({ onSetActiveContent }) => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const userName = localStorage.getItem('userFullName') || 'Employer';
    setUsername(userName);
  }, []);

  // Realistic summary data for an employer
  const summaryData = {
    activeJobs: 7,
    totalApplications: 62,
    hiresThisMonth: 4,
    avgResponseTime: 2.3, // Days
  };

  const handleViewDetails = (section) => {
    onSetActiveContent(section);
  };

  // Realistic card data with actions
  const cards = [
    {
      id: 1,
      title: 'Job Postings',
      record1: `Active: ${summaryData.activeJobs}`,
      record2: 'Drafts: 3',
      record3: 'Expired: 5',
      onViewDetails: () => handleViewDetails('JobPostings'),
      highlightColor: 'text-teal-600',
    },
    {
      id: 2,
      title: 'Applications',
      record1: `Received: ${summaryData.totalApplications}`,
      record2: 'Shortlisted: 18',
      record3: 'Interviews: 10',
      onViewDetails: () => handleViewDetails('Applications'),
      highlightColor: 'text-indigo-600',
    },
    {
      id: 3,
      title: 'Hiring Analytics',
      record1: 'Job Views: 245',
      record2: `Hires: ${summaryData.hiresThisMonth}`,
      record3: 'Avg. Time to Hire: 14 days',
      onViewDetails: () => handleViewDetails('Analytics'),
      highlightColor: 'text-green-600',
    },
    {
      id: 4,
      title: 'Notifications',
      record1: 'New: 4',
      record2: '2 applications need review',
      record3: '1 job expires soon',
      onViewDetails: () => handleViewDetails('Notifications'),
      highlightColor: 'text-orange-600',
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 bg-white">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-4 sm:mb-0">
          Welcome, <span className="text-teal-600">{username}</span>!
        </h1>
        <Button
          onClick={() => onSetActiveContent('JobPosting')}
          className="px-4 py-2 sm:px-5 sm:py-2.5 bg-teal-500 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-teal-600 focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-5 sm:w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Post a Job
        </Button>
      </div>

      {/* Summary Section */}
      <div className="w-full mb-6 sm:mb-8 bg-white border border-teal-200 rounded-lg p-4 sm:p-5 shadow-sm">
        <h2 className="text-lg sm:text-xl font-semibold text-teal-600 mb-3 sm:mb-4 tracking-tight">
          Your Hiring Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="text-center">
            <p className="text-xs sm:text-sm font-medium text-gray-600">Active Job Postings</p>
            <p className="text-base sm:text-lg font-semibold text-teal-600">{summaryData.activeJobs}</p>
          </div>
          <div className="text-center">
            <p className="text-xs sm:text-sm font-medium text-gray-600">Total Applications</p>
            <p className="text-base sm:text-lg font-semibold text-teal-600">{summaryData.totalApplications}</p>
          </div>
          <div className="text-center">
            <p className="text-xs sm:text-sm font-medium text-gray-600">Hires This Month</p>
            <p className="text-base sm:text-lg font-semibold text-teal-600">{summaryData.hiresThisMonth}</p>
          </div>
          <div className="text-center">
            <p className="text-xs sm:text-sm font-medium text-gray-600">Avg. Response Time</p>
            <p className="text-base sm:text-lg font-semibold text-teal-600">{summaryData.avgResponseTime} days</p>
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {cards.map((card) => (
          <EmpCard
            key={card.id}
            title={card.title}
            record1={card.record1}
            record2={card.record2}
            record3={card.record3}
            onViewDetails={card.onViewDetails}
            highlightColor={card.highlightColor}
            className="hover:shadow-md"
          />
        ))}
      </div>

      {/* Performance Chart Section */}
      <div className="w-full">
        <h2 className="text-lg sm:text-xl font-semibold text-teal-600 mb-3 sm:mb-4 tracking-tight">
          Hiring Performance
        </h2>
        <div className="bg-white border border-teal-200 rounded-lg p-4 sm:p-5 shadow-sm text-center">
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            Interactive chart coming soon (e.g., application trends, hire rates).
          </p>
        </div>
      </div>
    </div>
  );
};

EmpSummary.propTypes = {
  onSetActiveContent: PropTypes.func.isRequired,
};