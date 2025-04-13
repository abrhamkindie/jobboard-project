import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from "./Button.jsx";
import hiringImage from '../images/hiringImage.jpg';
import Input from "./Input.jsx";
import JobType from "./JobType.jsx";
import axios from 'axios';
import BASE_URL from './API.jsx';

export default function HeroSection() {
  const [jobType, setJobType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalEmployers, setTotalEmployers] = useState(0);
  const navigate = useNavigate();

  // Fetch total employers
  useEffect(() => {
    const fetchEmployerCount = () => {
      axios
        .get(`${BASE_URL}/jobs/total-employers`)
        .then((response) => {
          setTotalEmployers(response.data.total_employers);
        })
        .catch((error) => console.error("Error fetching employer count:", error));
    };

    fetchEmployerCount();
    const interval = setInterval(fetchEmployerCount, 10000);

    return () => clearInterval(interval);
  }, []);

  // Fetch total jobs
  useEffect(() => {
    const fetchJobCount = () => {
      axios
        .get(`${BASE_URL}/jobs/total-jobs`)
        .then((response) => {
          setTotalJobs(response.data.total_jobs);
        })
        .catch((error) => console.error("Error fetching job count:", error));
    };

    fetchJobCount();
    const interval = setInterval(fetchJobCount, 10000);

    return () => clearInterval(interval);
  }, []);

  // Memoize the stats cards to avoid unnecessary re-renders
  const statsCards = useMemo(() => [
    {
      id: 1,
      title: "Total Jobs",
      value: totalJobs,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 sm:h-7 sm:w-7 text-teal-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      gradient: "from-teal-500 to-teal-700",
      description: "Explore all opportunities",
    },
    {
      id: 2,
      title: "Companies",
      value: totalEmployers,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 sm:h-7 sm:w-7 text-teal-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
      gradient: "from-teal-500 to-teal-700",
      description: "Partnered with top employers",
    },
    {
      id: 3,
      title: "Active Candidates",
      value: "1,200+",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 sm:h-7 sm:w-7 text-teal-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      gradient: "from-teal-500 to-teal-700",
      description: "Ready to join your team",
    },
    {
      id: 4,
      title: "Job Success Rate",
      value: "95%",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 sm:h-7 sm:w-7 text-teal-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      gradient: "from-teal-500 to-teal-700",
      description: "High satisfaction rate",
    },
  ], [totalJobs, totalEmployers]);

  const handleSearch = () => {
    localStorage.setItem('searchFilters', JSON.stringify({ searchTerm, location, jobType }));
    navigate('/BrowseJobs');
  };

  return (
    <section
      className="w-full relative bg-cover bg-center min-h-[70vh] sm:min-h-[80vh]"
      style={{ backgroundImage: `url(${hiringImage})` }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-gray-900 opacity-70"></div>

      {/* Content Container */}
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center py-12 sm:py-16">
        {/* Heading */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3 sm:mb-4 tracking-tight">
          Find Your Dream Job <span className="text-teal-400">In Minutes</span>
        </h1>

        {/* Subheading */}
        <p className="text-base sm:text-lg lg:text-xl text-gray-200 mb-6 sm:mb-8 max-w-xl mx-auto font-medium">
          Browse thousands of jobs from top employers and take the next step in your career.
        </p>

        {/* Search Form */}
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row w-full max-w-4xl justify-center gap-3 sm:gap-4"
        >
          <Input
            placeholder="Search Job title, Keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:flex-1 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-teal-400 focus:border-transparent"
          />
          <Input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full sm:flex-1 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-teal-400 focus:border-transparent"
          />
          <JobType
            name="job-type"
            className="w-full sm:flex-1 rounded-lg border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-teal-400 focus:border-transparent"
            selectedValue={jobType}
            onChange={(e) => setJobType(e.target.value)}
          />
          <Button
            onClick={handleSearch}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-teal-500 text-white font-semibold hover:bg-teal-600 focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 transition-all duration-200"
          >
            Search
          </Button>
        </form>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full max-w-5xl mt-8 sm:mt-12">
          {statsCards.map((card) => (
            <div
              key={card.id}
              className={`p-4 sm:p-5 bg-gradient-to-r ${card.gradient} rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-white flex flex-col items-center`}
            >
              <div className="flex items-center mb-2">
                {card.icon}
                <h2 className="text-2xl sm:text-3xl font-bold">{card.value}</h2>
              </div>
              <p className="text-sm sm:text-base font-semibold">{card.title}</p>
              <p className="text-xs text-teal-100 mt-1">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}