import { useState, useEffect, useRef } from "react";
import axios from "axios";
import JobListing from "./JobListing.jsx";
import BASE_URL from "./API.jsx";
import { useNavigate } from "react-router-dom";

export default function FeaturedJobs() {
  const [jobList, setJobList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${BASE_URL}/jobs/job_lists`, {
        params: {
          page: 1,
          limit: 50,
          sortBy: "date",
        },
      })
      .then((response) => {
        if (Array.isArray(response.data) && response.data.length === 2) {
          setJobList(response.data[0]);
        } else {
          console.error("Unexpected API response format:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
      });
  }, []);

 

  const handleClickedJob = (job) => {
    localStorage.setItem("clickedJob", JSON.stringify(job));
    navigate("/BrowseJobs");
  };

  // Filter & Sort Jobs (Latest 9 Jobs)
  const sortedJobsByDate = [...jobList]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 9);

  // Duplicate the first few jobs at the end for seamless looping
  const duplicatedJobs = [...sortedJobsByDate, ...sortedJobsByDate.slice(0, 3)];

  // Auto-scroll every 5 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (prevIndex + 1 >= sortedJobsByDate.length) {
          setTimeout(() => {
            containerRef.current.style.transition = "none";
            setCurrentIndex(0);
            setTimeout(() => {
              containerRef.current.style.transition = "transform 1000ms ease-in-out";
            }, 50);
          }, 1000);
          return prevIndex + 1;
        }
        return prevIndex + 1;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [sortedJobsByDate.length, isPaused]);

  // Handle manual navigation (pagination dots)
  const goToIndex = (index) => {
    setCurrentIndex(index);
  };

  return (
    <section className="w-full text-center py-10 sm:py-12 bg-white">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-teal-600 mb-3 sm:mb-4 tracking-tight">
          Featured Jobs
        </h2>
        <p className="text-gray-600 text-sm sm:text-base lg:text-lg font-medium mb-6 sm:mb-8 max-w-xl mx-auto">
          Discover top opportunities from leading employers. Find your perfect job and apply today!
        </p>

        {/* Carousel Container */}
        <div
          className="overflow-hidden relative rounded-xl shadow-md"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            ref={containerRef}
            className="flex transition-transform duration-1000 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / 3)}%)`,
            }}
          >
            {duplicatedJobs.map((job, index) => (
              <div
                key={index}
                onClick={() => handleClickedJob(job)}
                className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 p-3 sm:p-4 hover:cursor-pointer group"
              >
                <JobListing
                  jobTitle={job.job_title}
                  companyName={job.company_name}
                  companyLogo={job.company_logo}
                  location={job.location}
                  salary={job.salary_range}
                  jobType={job.employment_type}
                  postingDate={job.created_at}
                  tags={["Featured", job.employment_type, job.location]}
                  companyRating={job.company_rating}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-teal-200 group-hover:scale-[1.02] h-full"
                  iconClassName="text-teal-500"
                />
              </div>
            ))}
          </div>

          {/* Gradient Overlays for Scroll Hint */}
          <div className="absolute inset-y-0 left-0 w-12 sm:w-16 bg-gradient-to-r from-white/80 to-transparent pointer-events-none hidden sm:block" />
          <div className="absolute inset-y-0 right-0 w-12 sm:w-16 bg-gradient-to-l from-white/80 to-transparent pointer-events-none hidden sm:block" />
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-4 sm:mt-6">
          {sortedJobsByDate.map((_, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full mx-1 sm:mx-1.5 transition-all duration-200 ${
                index === currentIndex % sortedJobsByDate.length
                  ? "bg-teal-500 scale-125"
                  : "bg-gray-300 hover:bg-teal-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}