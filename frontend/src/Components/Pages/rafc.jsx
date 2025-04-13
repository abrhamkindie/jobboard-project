 

        <div
  key={job.id}
  onClick={() => handleJobClick(job)}
  className={`border rounded-xl p-3 shadow-sm bg-white w-full md:w-80 hover:border-blue-800 transition-all duration-300 ${
    activeJobId === job.id
      ? "bg-blue-200 border-l-4 border-blue-500"
      : "bg-white hover:bg-gray-200"
  }`}
>
  {/* Featured Badge */}
  <div className="flex justify-between items-center mb-2">
    <span className="text-xs text-gray-600 flex gap-1">
      <FaCalendarCheck size={14} className="text-blue-600" />
      {formatPostingDate(job.created_at)}
    </span>
    <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-md shadow-sm">Featured</span>
  </div>

  {/* Job Title and Company Info (Inline Layout) */}
  <div className="flex items-center gap-3 mb-3">
    <div className="flex justify-center">
      <img
        src={job.company_logo || "/default-logo.png"}
        alt={job.company_name}
        className="w-10 h-10 rounded-full border-2 border-blue-200"
      />
    </div>
    <div className="flex-1">
      <h3 className="text-gray-700 text-sm font-semibold">
        {job.job_title} <span className="text-gray-500">({job.employment_type})</span>
      </h3>
      <p className="text-xs text-gray-600">{job.company_name}</p>
    </div>
  </div>

  {/* Location, Salary, and Employment Type (Under Profile) */}
  <div className="text-gray-700 text-xs mb-2 space-y-1">
    <p className="flex items-center gap-1"><MapPin size={14} className="text-blue-600" /> {job.location}</p>
    <p className="flex items-center gap-1"><FaDollarSign size={14} className="text-blue-600" /> {job.salary_range}</p>
  </div>

  {/* View Details and Save Button (Horizontal Layout) */}
  <div className="flex justify-between items-center mt-2">
    <a
      href={`/job/${job.id}`}
      className="text-blue-600 text-xs font-medium hover:text-blue-800"
    >
      View Details
    </a>
    <Button
      onClick={(e) => {
        e.stopPropagation();
        handleSaveJob(job);
      }}
      className={`border px-3 py-1 rounded-md text-xs ${
        savedJobs.includes(job.id)
          ? "text-amber-600 border-amber-600"
          : "text-blue-600 border-blue-600"
      } hover:bg-blue-50 transition-all duration-300`}
    >
      <FaBookmark className="inline-block mr-1" />{" "}
      <span className="text-sm">{savedJobs.includes(job.id) && authToken ? "Saved" : "Save"}</span>
    </Button>
  </div>
</div>
