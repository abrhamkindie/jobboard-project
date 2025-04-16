// const {insertIntoDatabase}=require('../utils/helpers')
// const  Base_Url  = require('../config/Base_Url');

// const isDriveUrl = (url) => url && url.startsWith("https://drive.google.com/");
 
// exports.handleJobSeeker = (req, res) => {
//   const { full_name, email, phone, password, job_title, skills, experience_level, location_preference } = req.body;

//   // Validate required fields
//   if (!full_name || !email || !phone || !password || !job_title || !skills || !experience_level || !location_preference) {
//     return res.status(400).json({ error: 'Missing required fields' });
//   }

//   // Validate file uploads
//   if (!req.files || !req.files.resume || !req.files.profile) {
//     return res.status(400).json({ error: 'Resume and profile photo are required' });
//   }

//   // Construct file paths
  

//   const resume = req.files?.resume?.[0]?.path || null;
//   const profile = req.files?.profile?.[0]?.path || null;

 
//     // Prepare data for insertion
//     const seekerData = {
//       full_name,
//       email,
//       phone,
//       password,
//       job_title ,
//       skills,
//       experience_level,
//       location_preference,
//       profile,
//       resume,
//     };
  

//   // Insert into database
//   insertIntoDatabase('seekers', seekerData, res,req.db);
// };

 

// exports.handleEmployer = async (req, res) => {
//   res.status(501).json({ error: 'Employer signup not implemented' });
// };


 

// // Handle employer registration
//  exports.handleEmployer = (req, res) => {
//   const { full_name, email, phone, password, company_name, industry, company_size, job_description } = req.body;

//   // Validate required fields
//   if (!full_name || !email || !phone || !password || !company_name || !industry || !company_size || !job_description) {
//     return res.status(400).json({ error: 'Missing required fields' });
//   }

//   // Validate file upload (logo is optional)
//    const logo = req.files?.logo?.[0]?.path || null;

//   // Prepare data for insertion
//   const employerData = {
//     full_name,
//     email,
//     phone,
//     password,
//     company_name,
//     industry,
//     company_size,
//     job_description,
//     logo
//   };

//   // Insert into database
//   insertIntoDatabase('employers', employerData, res,req.db);
// };
// // Handle job posting


// exports.createJobPost = (req, res) => {

//   const {
//     Job_title,
//     Company_name,
//     Location,
//     Employment_type,
//     Salary_range,
//     job_description,
//     Key_responsibilities,
//     Requirements,
//     Preferred_qualifications,
//     Benefits,
//     Application_deadline,
//     How_to_apply,
//     employer_id,
//   } = req.body;

//   if (!Job_title || !Company_name || !Location) {
//     return res.status(400).json({ error: 'Job title, company name, and location are required.' });
//   }

//   const Job_posting_Data = {
//     Job_title,
//     Company_name,
//     Location,
//     Employment_type,
//     Salary_range,
//     job_description,
//     Key_responsibilities,
//     Requirements,
//     Preferred_qualifications,
//     Benefits,
//     Application_deadline,
//     How_to_apply,
//     employer_id,
//   };

//   insertIntoDatabase('job_postings', Job_posting_Data, res,req.db);
// };



// // Get all job listings
// exports.getJobListings = (req, res) => {
//    const { search, location, employmentType, salaryRange, sortBy, page = 1, limit = 50 } = req.query;
//   const offset = (page - 1) * limit;

//   let query = `
//     SELECT jp.*, e.logo AS company_logo
//     FROM job_postings jp
//     JOIN employers e ON jp.employer_id = e.employer_id
//     WHERE 1=1
//   `;

//   const queryParams = [];

//   // Search
//   if (search) {
//     query += ` AND (jp.Job_title LIKE ? OR jp.Company_name LIKE ? OR jp.Location LIKE ?)`;
//     queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
//   }

//   // Filters
//   if (location) query += ` AND jp.Location = ?`, queryParams.push(location);
//   if (employmentType) query += ` AND jp.Employment_type = ?`, queryParams.push(employmentType);
//   if (salaryRange) {
//     const [minSalary, maxSalary] = salaryRange.split('-').map(Number);
//     query += ` AND jp.Salary_range BETWEEN ? AND ?`, queryParams.push(minSalary, maxSalary);
//   }

//   // Sorting
//   if (sortBy === 'date') query += ` ORDER BY jp.created_at DESC`;
//   else if (sortBy === 'salary') query += ` ORDER BY jp.Salary_range DESC`;
//   else if (sortBy === 'title') query += ` ORDER BY jp.Job_title ASC`;

//   // Pagination
//   query += ` LIMIT ? OFFSET ?`;
//   queryParams.push(Number(limit), Number(offset));

//   req.db.query(query, queryParams, (err, result) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).send('Error fetching job postings');
//     }
 

//     result.forEach((job) => {
//       if (job.company_logo && !isDriveUrl(job.company_logo)) {
//         job.company_logo = `${Base_Url}${job.company_logo}`;
//       }
//     });


  

//     // Get total count for pagination
//     let countQuery = `SELECT COUNT(*) as total FROM job_postings jp JOIN employers e ON jp.employer_id = e.employer_id WHERE 1=1`;
//     const countParams = queryParams.slice(0, -2); // Exclude LIMIT and OFFSET

//     req.db.query(countQuery, countParams, (err, countResult) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).send('Error fetching total job count');
//       }

//       const totalJobs = countResult[0].total;
//       const totalPages = Math.ceil(totalJobs / limit);

 
//       return res.json([
//                 result,  
//                 {
//                   totalJobs,
//                   totalPages,
//                   currentPage: Number(page),
//                   jobsPerPage: Number(limit),
//                 }
//           ]);
//     });
//   });


// };

 
// exports.getEmployerJobs = (req, res) => {
//   const db = req.db;
//   const { employer_id } = req.query;

//    if (!employer_id) {
//     return res.status(400).json({ error: 'Employer ID is required' });
//   }

//    const query = `
//     SELECT jp.*, e.logo AS company_logo
//     FROM job_postings jp
//     JOIN employers e ON jp.employer_id = e.employer_id
//     WHERE jp.employer_id = ?
//   `;

//   // Execute the query
//   db.query(query, [employer_id], (err, results) => {
//     if (err) {
//       console.error('Error fetching employer jobs:', err);
//       return res.status(500).json({ error: 'Error fetching employer jobs', details: err.message });
//     }
 



//     results.forEach((job) => {
//       if (job.company_logo && !isDriveUrl(job.company_logo)) {
//         job.company_logo = `${Base_Url}${job.company_logo}`;
//       }
//     });

 
//      res.status(200).json(results);
//   });
// };


//       exports.getTotalJobs = (req, res) => {


//   const countQuery = 'SELECT COUNT(*) AS total_jobs FROM job_postings';

//   req.db.query(countQuery, (err, result) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ message: 'Error fetching job count' });
//     }
//     const totalJobs = result[0].total_jobs;
//     res.setHeader('Content-Type', 'application/json');
//     return res.json({ total_jobs: totalJobs });
//   });
// };

// //app.get('/total-employers', (req, res) => {
//   exports.getTotalEmployers = (req, res) => {

//   const countQuery = 'SELECT COUNT(*) AS total_totalEmployers FROM  employers';

//   req.db.query(countQuery, (err, result) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ message: 'Error fetching job count' });
//     }
//     const totalEmployers = result[0].total_totalEmployers;
//     res.setHeader('Content-Type', 'application/json');
//     return res.json({ total_employers: totalEmployers });
//   });
// };




// // Get a single job post by ID
// exports.getJobPost = (req, res) => {
//   const { id } = req.params;
//   req.db.query('SELECT * FROM job_postings WHERE id = ?', [id], (err, results) => {
//     if (err) {
//       console.error('Error fetching job post:', err);
//       return res.status(500).json({ error: 'Error fetching job post', details: err.message });
//     }
//     if (results.length === 0) {
//       return res.status(404).json({ error: 'Job post not found' });
//     }
//     res.status(200).json(results[0]);
//   });
// };

// // Edit a job post
// exports.editJobPost = (req, res) => {
//   const { id } = req.params;
//   const updatedData = req.body;
//   req.db.query('UPDATE job_postings SET ? WHERE id = ?', [updatedData, id], (err, result) => {
//     if (err) {
//       console.error('Error updating job post:', err);
//       return res.status(500).json({ error: 'Error updating job post', details: err.message });
//     }
//     res.json({ message: 'Job post updated successfully' });
//   });
// };

// // Delete a job post
// exports.deleteJobPost = (req, res) => {
//   const { id } = req.params;
//   req.db.query('DELETE FROM job_postings WHERE id = ?', [id], (err, result) => {
//     if (err) {
//       console.error('Error deleting job post:', err);
//       return res.status(500).json({ error: 'Error deleting job post', details: err.message });
//     }
//     res.json({ message: 'Job post deleted successfully' });
//   });
// };



// // Handle job application
// exports.applyJob = (req, res) => {

//    const { job_id, jobSeeker_id, fullName, email, coverLetter ,linkedIn,phone,portfolio} = req.body;

//   if (!req.file) {
//     return res.status(400).json({ error: 'Resume file is required' });
//   }

//    const resume = req.file?.path || null;

//   const applicationData = {
//     job_id,
//     jobSeeker_id,
//     full_name: fullName,
//     email,
//     resume,
//     cover_letter: coverLetter,
//     linkedIn:linkedIn,
//     phone:phone,
//     portfolio:portfolio
//   };

//   insertIntoDatabase('job_applications', applicationData, res,req.db);
// };

// exports.updateApplicationStatus = (req, res) => {
//   const { Job_id, status, applicant_Id } = req.body;

//   if (!Job_id || !status || !applicant_Id) {
//     return res.status(400).json({ error: 'Missing required parameters' });
//   }

//   // Validate status
//   const validStatuses = ['Pending', 'Accepted', 'Interview', 'Hired', 'Rejected'];
//   if (!validStatuses.includes(status)) {
//     return res.status(400).json({ error: 'Invalid status value' });
//   }

//   // Verify application exists
//   const selectQuery = 'SELECT status FROM job_applications WHERE job_id = ? AND jobseeker_id = ?';
//   req.db.query(selectQuery, [Job_id, applicant_Id], (selectErr, selectResult) => {
//     if (selectErr) {
//       console.error('Error fetching application:', selectErr);
//       return res.status(500).json({ error: 'Error fetching application', details: selectErr.message });
//     }

//     if (selectResult.length === 0) {
//       return res.status(404).json({ error: 'Application not found' });
//     }

//     // Update status
//     const updateQuery = `
//       UPDATE job_applications 
//       SET status = ?
//       WHERE job_id = ? AND jobseeker_id = ?`;
//     const values = [status, Job_id, applicant_Id];

//     req.db.query(updateQuery, values, (err, response) => {
//       if (err) {
//         console.error('Error updating status:', err);
//         return res.status(500).json({ error: 'Error updating status', details: err.message });
//       }

//       if (response.affectedRows === 0) {
//         return res.status(404).json({ error: 'Application not found or no changes made' });
//       }

//       return res.json({ success: 'Status updated successfully' });
//     });
//   });
// };




// exports.scheduleInterview = (req, res) => {
 

//   const { Job_id, applicant_Id, interview_date, interview_type, interview_location, phone_number, zoom_link, dress_code } = req.body;
//   const employer_id = parseInt(req.user.employer_id, 10);

//   // Comprehensive validation
//   if (!Job_id || !applicant_Id || !interview_date || !interview_type || isNaN(employer_id)) {
//     return res.status(400).json({ 
//       error: 'Missing required parameters', 
//       details: 'Job_id, applicant_Id, interview_date, and interview_type are required.' 
//     });
//   }

//   const jobIdInt = parseInt(Job_id, 10);
//   const applicantIdInt = parseInt(applicant_Id, 10);
//   if (isNaN(jobIdInt) || isNaN(applicantIdInt)) {
//     return res.status(400).json({ error: 'Invalid IDs', details: 'Job_id and applicant_Id must be valid numbers.' });
//   }

//   const validInterviewTypes = ['In-Person', 'Phone Call', 'Video Call'];
//   if (!validInterviewTypes.includes(interview_type)) {
//     return res.status(400).json({ error: 'Invalid interview type', details: 'Must be one of: In-Person, Phone Call, Video Call.' });
//   }
//   if (interview_type === 'In-Person' && (!interview_location || interview_location.trim() === '')) {
//     return res.status(400).json({ error: 'Interview location required', details: 'Location must be provided for In-Person interviews.' });
//   }
//   if (interview_type === 'Phone Call' && (!phone_number || !/^\+?\d{7,15}$/.test(phone_number))) {
//     return res.status(400).json({ error: 'Invalid phone number', details: 'Phone number must be 7-15 digits, optionally starting with "+".' });
//   }
//   if (interview_type === 'Video Call' && (!zoom_link || !/^https?:\/\/.+\..+/.test(zoom_link))) {
//     return res.status(400).json({ error: 'Invalid Zoom link', details: 'Zoom link must be a valid URL.' });
//   }

//   const interviewDateObj = new Date(interview_date);
//   if (isNaN(interviewDateObj.getTime()) || interviewDateObj < new Date()) {
//     return res.status(400).json({ error: 'Invalid date', details: 'Interview date must be a valid future date.' });
//   }

//   // Use req.file since we're using upload.single('file')
//    const document_url = req.file?.path || null;

//   const interviewData = {
//     job_id: jobIdInt,
//     jobseeker_id: applicantIdInt,
//     employer_id,
//     interview_date: interviewDateObj,
//     interview_type,
//     interview_location: interview_type === 'In-Person' ? interview_location.trim() : null,
//     phone_number: interview_type === 'Phone Call' ? phone_number.trim() : null,
//     zoom_link: interview_type === 'Video Call' ? zoom_link.trim() : null,
//     dress_code: dress_code ? dress_code.trim() : null,
//     document_url,
//     status: 'Scheduled',
//     created_at: new Date(),
//   };

//   // Verify job ownership and get job details
//   req.db.query(
//     'SELECT Job_title, Company_name FROM job_postings WHERE id = ? AND employer_id = ?',
//     [jobIdInt, employer_id],
//     (err, job) => {
//       if (err) {
//         console.error('Database error:', err);
//         return res.status(500).json({ error: 'Database error', details: err.message });
//       }
//       if (job.length === 0) {
//         return res.status(403).json({ error: 'Unauthorized', details: 'Job not found or you are not authorized.' });
//       }

//       const jobDetails = job[0];

//       // Check for existing scheduled interview
//       req.db.query(
//         'SELECT id FROM interviews WHERE job_id = ? AND jobseeker_id = ? AND status = "Scheduled"',
//         [jobIdInt, applicantIdInt],
//         (err, existingInterview) => {
//           if (err) {
//             console.error('Database error:', err);
//             return res.status(500).json({ error: 'Database error', details: err.message });
//           }
//           if (existingInterview.length > 0) {
//             return res.status(409).json({ error: 'Conflict', details: 'An interview is already scheduled for this applicant and job.' });
//           }

//           // Insert interview
//           req.db.query(
//             'INSERT INTO interviews SET ?',
//             interviewData,
//             (err, result) => {
//               if (err) {
//                 console.error('Insert error:', err);
//                 return res.status(500).json({ error: 'Failed to schedule interview', details: err.message });
//               }

//               const interviewId = result.insertId;

//               // Update application status to "Interview"
//               req.db.query(
//                 'UPDATE job_applications SET status = "Interview" WHERE job_id = ? AND jobseeker_id = ?',
//                 [jobIdInt, applicantIdInt],
//                 (err) => {
//                   if (err) {
//                     console.error('Update error:', err);
//                     return res.status(500).json({ error: 'Failed to update application status', details: err.message });
//                   }

//                   const notificationData = {
//                     interview_id: interviewId,
//                     job_id: jobIdInt,
//                     interview_date: interviewDateObj.toISOString(),
//                     interview_type,
//                     interview_location: interviewData.interview_location,
//                     phone_number: interviewData.phone_number,
//                     zoom_link: interviewData.zoom_link,
//                     dress_code: interviewData.dress_code || 'Not specified',
//                     document_url,
//                     jobTitle: jobDetails.Job_title,
//                     companyName: jobDetails.Company_name,
//                     scheduledAt: interviewData.created_at.toISOString(),
//                   };

//                   req.io.to(applicantIdInt.toString()).emit('interviewScheduled', notificationData);

//                   res.status(201).json({
//                     success: 'Interview scheduled successfully',
//                     interview_id: interviewId,
//                     interview_date: interviewDateObj.toISOString(),
//                     document_url,
//                   });
//                 }
//               );
//             }
//           );
//         }
//       );
//     }
//   );
// };

// exports.getJobApplicants = (req, res) => {
//   const { Job_id } = req.query;
//   const employerId = req.user.employer_id;

//   if (!Job_id || !employerId) {
//     return res.status(400).json({ error: "Job ID and Employer ID are required" });
//   }

//   const query = `
//     SELECT 
//       ja.job_id,
//       ja.full_name,
//       ja.email,
//       ja.jobseeker_id AS ApplicantId,
//       ja.resume AS applicantResume,
//       ja.cover_letter AS coverLetter,
//       ja.linkedin AS applicantLinkedIn,
//       ja.portfolio AS ApplicantPortfolio,
//       ja.created_at AS appliedDate,
//       ja.status,
//       s.profile AS ApplicantProfile,
//       i.interview_date AS interviewScheduled
//     FROM job_applications ja
//     JOIN job_postings jp ON ja.job_id = jp.id
//     JOIN seekers s ON ja.jobseeker_id = s.id
//     LEFT JOIN interviews i ON ja.job_id = i.job_id AND ja.jobseeker_id = i.jobseeker_id AND i.status = 'Scheduled'
//     WHERE ja.job_id = ? AND jp.employer_id = ?
//     ORDER BY ja.created_at DESC
//   `;

//   req.db.query(query, [Job_id, employerId], (err, result) => {
//     if (err) {
//       return res.status(500).json({ error: "Database error", details: err.message });
//     }

//     // Append Base_Url to ApplicantProfile if it exists
//       result.forEach((job) => {
//       if (job.ApplicantProfile && !isDriveUrl(job.ApplicantProfile)) {
//         job.ApplicantProfile = `${Base_Url}${job.ApplicantProfile}`;
//       }
//       if (job.applicantResume && !isDriveUrl(job.applicantResume)) {
//         job.applicantResume = `${Base_Url}${job.applicantResume}`;
//       }
//     });



//     res.status(200).json(result || []);
//   });
// };



//    exports.getAppliedJobs = (req, res) => {

//     const { jobSeeker_id } = req.query;
  
//     if (!jobSeeker_id) {
//       return res.status(400).json({ error: "JobSeeker ID is required" });
//     }
  
//     const query = `SELECT job_id FROM job_applications WHERE jobSeeker_id = ?`;
  
//     req.db.query(query, [jobSeeker_id], (err, result) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).json({ error: "Error fetching applied jobs" });
//       }
  
//       res.json(result.map(job => job.job_id));
//     });
//   };




//   exports.getMyApplication = (req, res) => {
//     const { jobSeeker_id } = req.query;
  
//     if (!jobSeeker_id) {
//       return res.status(400).json({ error: "JobSeeker ID is required" });
//     }
  
//     // Ensure jobSeeker_id is treated as an integer if your DB expects it
//     const jobSeekerId = parseInt(jobSeeker_id, 10);
//     if (isNaN(jobSeekerId)) {
//       return res.status(400).json({ error: "Invalid JobSeeker ID" });
//     }
  
//     const query = `
//     SELECT 
//       jp.id,
//       jp.Job_title AS title,
//       jp.Company_name AS companyName,
//       jp.Location AS location,
//       jp.Employment_type AS employmentType,
//       jp.job_description AS description,
//       jp.salary_range AS salaryRange,   
//       jp.created_at AS postedDate,     
//       ja.created_at AS appliedDate,
//       ja.full_name AS applicantName,
//       ja.email AS applicantEmail,
//       ja.resume AS applicantResume,
//       ja.cover_letter AS coverLetter,  
//       ja.linkedIn AS applicantLinkedIn,
//       ja.portfolio AS ApplicantPortfolio,  
//       ja.status AS applicationStatus,
//       i.interview_date AS interviewDate,
//       i.status AS interviewStatus,
//       e.logo AS companyLogo
//     FROM job_applications ja
//     JOIN job_postings jp ON ja.job_id = jp.id
//     JOIN employers e ON jp.employer_id = e.employer_id
//     LEFT JOIN interviews i ON ja.job_id = i.job_id AND ja.jobseeker_id = i.jobseeker_id
//     WHERE ja.jobSeeker_id = ?
//     ORDER BY ja.created_at DESC
//   `;
//     req.db.query(query, [jobSeekerId], (err, result) => {
//       if (err) {
//         console.error('Database query error:', err);
//         return res.status(500).json({ 
//           error: "Error fetching applied jobs", 
//           details: err.message || 'Unknown database error' 
//         });
//       }
  
//       // If no results, return empty array instead of error
//       if (!result || result.length === 0) {
//         return res.status(200).json([]);
//       }
  
//       result.forEach((job) => {
//         if (job.companyLogo && !isDriveUrl(job.companyLogo)) {
//           job.companyLogo = `${Base_Url}${job.companyLogo}`;
//         }
//         if (job.applicantResume && !isDriveUrl(job.applicantResume)) {
//           job.applicantResume = `${Base_Url}${job.applicantResume}`;
//         }
//       });

      
//       res.status(200).json(result);
//     });
//   };


//   exports.withdrawApplication = (req, res) => {
//     const { job_id, jobSeeker_id } = req.body;
//     if (!job_id || !jobSeeker_id) {
//       return res.status(400).json({ error: 'Job ID and JobSeeker ID are required' });
//     }
  
//     const query = `DELETE FROM job_applications WHERE job_id = ? AND jobSeeker_id = ?`;
//     req.db.query(query, [job_id, jobSeeker_id], (err, result) => {
//       if (err) return res.status(500).json({ error: 'Error withdrawing application', details: err.message });
//       if (result.affectedRows === 0) return res.status(404).json({ error: 'Application not found' });
//       res.json({ message: 'Application withdrawn successfully' });
//     });
//   };


//   exports.getInterviewCount = (req, res) => {
//     const jobSeeker_id =  req.user.jobSeeker_id || req.user.employer_id || req.user.id;


//      if (req.user.role !== 'seeker') {
//       return res.status(403).json({ error: 'Unauthorized: Seeker role required' });
//     }
  
//     const query = `
//       SELECT COUNT(*) AS interviewCount
//       FROM interviews
//       WHERE jobseeker_id = ? AND status = 'Scheduled'
//     `;
//     req.db.query(query, [jobSeeker_id], (err, result) => {
//       if (err) {
//         console.error('Interview count error:', err);
//         return res.status(500).json({ error: 'Database error', details: err.message });
//       }
//       res.json({ count: result[0].interviewCount });
//     });
//   };
  
  
//   exports.getInterviewAlerts = (req, res) => {
//     const jobSeeker_id = req.user.jobSeeker_id || req.user.employer_id || req.user.id;
//     if (req.user.role !== 'seeker') {
//       return res.status(403).json({ error: 'Unauthorized: Seeker role required' });
//     }
  
//     const query = `
//       SELECT 
//         i.job_id, i.interview_date, i.interview_type, i.status AS interviewStatus,
//         i.zoom_link, i.dress_code, i.document_url,
//         jp.Job_title AS jobTitle, jp.Company_name AS companyName
//       FROM interviews i
//       JOIN job_postings jp ON i.job_id = jp.id
//       WHERE i.jobseeker_id = ? AND i.status = 'Scheduled'
//       ORDER BY i.interview_date ASC
//     `;
//     req.db.query(query, [jobSeeker_id], (err, result) => {
//       if (err) {
//         console.error('Interview alerts error:', err);
//         return res.status(500).json({ error: 'Database error', details: err.message });
//       }
    
//       result.forEach((alert) => {
//         if (alert.document_url && !isDriveUrl(alert.document_url)) {
//           alert.document_url = `${Base_Url}${alert.document_url}`;
//         }
//       });


//       res.json(result);
//     });
//   };


 

//   exports.getInterviews = (req, res) => {
//     const jobSeeker_id = parseInt(  req.user.jobSeeker_id ||req.user.employer_id || req.user.id || req.query.jobSeeker_id, 10);
  
//     if (isNaN(jobSeeker_id)) {
//       return res.status(400).json({ error: 'Invalid JobSeeker ID', details: 'JobSeeker ID must be a valid number' });
//     }
  
//     const query = `
//       SELECT 
//         i.id,
//         i.job_id,
//         i.jobseeker_id,
//         i.employer_id,
//         i.interview_date,
//         i.interview_type,
//         i.interview_location,
//         i.phone_number,
//         i.zoom_link,
//         i.dress_code,
//         i.document_url,
//         i.status,
//         i.created_at,
//         jp.Job_title AS jobTitle,
//         jp.Company_name AS companyName,
//         e.logo AS companyLogo
//       FROM interviews i
//       JOIN job_postings jp ON i.job_id = jp.id
//       JOIN employers e ON i.employer_id = e.employer_id
//       WHERE i.jobseeker_id = ? AND i.status IN ('Scheduled', 'Confirmed', 'Declined')
//       ORDER BY i.interview_date ASC
//     `;
  
//     req.db.query(query, [jobSeeker_id], (err, results) => {
//       if (err) {
//         console.error('Database error:', err);
//         return res.status(500).json({ error: 'Database error', details: err.message });
//       }
  
//       results.forEach((interview) => {
//         if (interview.companyLogo && !isDriveUrl(interview.companyLogo)) {
//           interview.companyLogo = `${Base_Url}${interview.companyLogo}`;
//         }
//         if (interview.document_url && !isDriveUrl(interview.document_url)) {
//           interview.document_url = `${Base_Url}${interview.document_url}`;
//         }
//       });


  
//       res.status(200).json(results);
//     });
//   };
   
//   exports.confirmInterview = (req, res) => {
//     const { interview_id, response } = req.body;
//     const jobSeeker_id = parseInt(req.user.employer_id || req.user.jobSeeker_id || req.user.id, 10);
  
//     if (!interview_id || !response) {
//       return res.status(400).json({ error: 'Missing required fields' });
//     }
  
//     if (!['Confirmed', 'Declined'].includes(response)) {
//       return res.status(400).json({ error: 'Invalid response' });
//     }
  
//     const query = `
//       UPDATE interviews 
//       SET status = ? 
//       WHERE id = ? AND jobseeker_id = ? AND status = 'Scheduled'
//     `;
//     req.db.query(query, [response, interview_id, jobSeeker_id], (err, result) => {
//       if (err) {
//         console.error('Database error:', err);
//         return res.status(500).json({ error: 'Database error', details: err.message });
//       }
  
//       if (result.affectedRows === 0) {
//         return res.status(404).json({ error: 'Interview not found or already responded' });
//       }
  
//       // Fetch employer_id and job details
//       req.db.query(
//         'SELECT employer_id, job_id FROM interviews WHERE id = ?',
//         [interview_id],
//         (err, interview) => {
//           if (err || !interview[0]) {
//             console.error('Error fetching interview:', err);
//             return res.status(500).json({ error: 'Notification error', details: err?.message });
//           }
  
//           const employer_id = interview[0].employer_id;
//           const job_id = interview[0].job_id;
  
//           req.db.query(
//             'SELECT Job_title, Company_name FROM job_postings WHERE id = ?',
//             [job_id],
//             (err, job) => {
//               if (err || !job[0]) {
//                 console.error('Error fetching job:', err);
//                 return res.status(500).json({ error: 'Notification error', details: err?.message });
//               }
  
//               const notificationData = {
//                 interview_id,
//                 response,
//                 jobseeker_id: jobSeeker_id,
//                 jobTitle: job[0].Job_title,
//                 companyName: job[0].Company_name,
//                 timestamp: new Date().toISOString(),
//               };
  
//               req.io.to(`employer:${employer_id}`).emit('interviewResponse', notificationData);
//               res.json({ success: `${response} successfully` });
//             }
//           );
//         }
//       );
//     });
//   };












 

//   exports.getEmployerInterviews = (req, res) => {
//     const employer_id = parseInt(req.user.employer_id, 10);
  
//     if (req.user.role !== 'employer') {
//       return res.status(403).json({ error: 'Unauthorized', details: 'Only employers can view interviews' });
//     }
//     if (isNaN(employer_id)) {
//       return res.status(401).json({ error: 'Unauthorized', details: 'Invalid employer ID' });
//     }
  
//     const query = `
//       SELECT 
//         i.id AS interview_id,
//         i.job_id,
//         i.jobseeker_id AS jobSeekerId,
//         i.interview_date,
//         i.interview_type,
//         i.interview_location,
//         i.phone_number,
//         i.zoom_link,
//         i.dress_code,
//         i.document_url,
//         i.status,
//         i.created_at,
//         jp.Job_title AS jobTitle,
//         jp.Company_name AS companyName,
//         s.full_name AS jobSeekerName,
//         s.email AS jobSeekerEmail,
//         s.phone AS jobSeekerPhone,
//         s.bio AS jobSeekerBio,
//         s.skills AS jobSeekerSkills,
//         s.education AS jobSeekerEducation,
//         s.work_experience AS jobSeekerExperience,
//         s.certifications AS jobSeekerCertifications,
//         s.linkedin  AS jobSeekerLinkedIn,
//         s.github  AS jobSeekerGitHub,
//         s.availability AS jobSeekerAvailability,
//         s.profile  AS jobSeekerProfilePicture, -- Added profile picture
//         ja.resume AS jobSeekerResume
//       FROM interviews i
//       JOIN job_postings jp ON i.job_id = jp.id
//       JOIN seekers s ON i.jobseeker_id = s.id
//       JOIN job_applications ja ON i.job_id = ja.job_id AND i.jobseeker_id = ja.jobseeker_id
//       WHERE i.employer_id = ?
//       ORDER BY i.interview_date ASC
//     `;
  
//     req.db.query(query, [employer_id], (err, results) => {
//       if (err) {
//         console.error('Database error:', err);
//         return res.status(500).json({ error: 'Database error', details: err.message });
//       }
  



//       results.forEach((interview) => {
//         if (interview.jobSeekerResume && !isDriveUrl(interview.jobSeekerResume)) {
//           interview.jobSeekerResume = `${Base_Url}${interview.jobSeekerResume}`;
//         }
//         if (interview.document_url && !isDriveUrl(interview.document_url)) {
//           interview.document_url = `${Base_Url}${interview.document_url}`;
//         }
//         if (interview.jobSeekerProfilePicture && !isDriveUrl(interview.jobSeekerProfilePicture)) {
//           interview.jobSeekerProfilePicture = `${Base_Url}${interview.jobSeekerProfilePicture}`;
//         }
//       });

  
//       res.status(200).json(results);
//     });
//   };




  
//   // [Optional] Helper endpoint to get interview details for employer (if needed later)
//   exports.getInterviewDetails = (req, res) => {
//     const { interview_id } = req.query;
//     const employer_id = parseInt(req.user.employer_id, 10);
  
//     if (!interview_id) {
//       return res.status(400).json({ error: 'Missing interview_id' });
//     }
  
//     const query = `
//       SELECT 
//         i.*,
//         jp.Job_title AS jobTitle,
//         jp.Company_name AS companyName,
//         s.full_name AS jobseekerName,
//         s.email AS jobseekerEmail,
//         ja.resume AS jobseekerResume
//       FROM interviews i
//       JOIN job_postings jp ON i.job_id = jp.id
//       JOIN seekers s ON i.jobseeker_id = s.id
//       JOIN job_applications ja ON i.job_id = ja.job_id AND i.jobseeker_id = ja.jobseeker_id
//       WHERE i.id = ? AND i.employer_id = ?
//     `;
  
//     req.db.query(query, [interview_id, employer_id], (err, results) => {
//       if (err) {
//         console.error('Database error:', err);
//         return res.status(500).json({ error: 'Database error', details: err.message });
//       }
  
//       if (results.length === 0) {
//         return res.status(404).json({ error: 'Interview not found or unauthorized' });
//       }
  
//       const interview = results[0];
//       if (interview.jobseekerResume && !isDriveUrl(interview.jobseekerResume)) {
//         interview.jobseekerResume = `${Base_Url}${interview.jobseekerResume}`;
//       }
//       if (interview.document_url && !isDriveUrl(interview.document_url)) {
//         interview.document_url = `${Base_Url}${interview.document_url}`;
//       }
  
//       res.status(200).json(interview);
//     });
//   };

 


//   // Send a message
//   exports.sendMessage = (req, res) => {

//     const sender_id = req.user.jobSeeker_id || req.user.employer_id || req.user.id;
//     const { receiver_id, receiver_role, message } = req.body;
//     const sender_role = req.user.role;
  
//     console.log('sendMessage input:', { sender_id, sender_role, receiver_id, receiver_role, message });
  
//     if (!receiver_id || !receiver_role || !message) {
//       return res.status(400).json({ error: 'Missing required fields: receiver_id, receiver_role, message' });
//     }
  
//     const parsedReceiverId = parseInt(receiver_id);
//     if (isNaN(parsedReceiverId)) {
//       return res.status(400).json({ error: 'Invalid receiver_id: must be a number' });
//     }
  
//     if (!['employer', 'seeker'].includes(receiver_role)) {
//       return res.status(400).json({ error: 'Invalid receiver_role: must be "employer" or "seeker"' });
//     }
  
//     if (!message.trim()) {
//       return res.status(400).json({ error: 'Message cannot be empty' });
//     }
  
//     // Fetch sender name
  
//   const userId= receiver_role === 'seeker' ? 'id':'employer_id' ;
  
//     const senderNameQuery = sender_role === 'seeker'
//       ? 'SELECT full_name AS name FROM seekers WHERE id = ?'
//       : 'SELECT company_name AS name FROM employers WHERE 	employer_id  = ?';
  
//     req.db.query(senderNameQuery, [sender_id], (err, senderResult) => {
//       if (err) {
//         console.error('Sender query error:', err);
//         return res.status(500).json({ error: 'Database error fetching sender', details: err.message });
//       }
//       if (!senderResult[0]) {
//         return res.status(404).json({ error: 'Sender not found' });
//       }
  
//       const sender_name = senderResult[0].name;
  
//       // Validate receiver exists
//       const receiverTable = receiver_role === 'seeker' ? 'seekers' : 'employers';
//       const receiverNameField = receiver_role === 'seeker' ? 'full_name' : 'company_name';
//       req.db.query(
//         `SELECT ${receiverNameField} AS name FROM ${receiverTable} WHERE 	${userId} = ?`,
//         [parsedReceiverId],
//         (err, receiverResult) => {
//           if (err) {
//             console.error('Receiver query error:', err);
//             return res.status(500).json({ error: 'Database error fetching receiver', details: err.message });
//           }
//           if (!receiverResult[0]) {
//             return res.status(404).json({ error: `Receiver ${receiver_role} ID ${parsedReceiverId} not found` });
//           }
  
//           const messageData = {
//             sender_id,
//             sender_role,
//             receiver_id: parsedReceiverId,
//             receiver_role,
//             message: message.trim(),
//             sender_name,
//             created_at: new Date(),
//             is_read: false,
//           };
  
//           req.db.query('INSERT INTO messages SET ?', messageData, (err, result) => {
//             if (err) {
//               console.error('Insert message error:', err);
//               return res.status(500).json({ error: 'Failed to send message', details: err.message });
//             }
  
//             const messageId = result.insertId;
//             const notificationData = {
//               id: messageId,
//               sender_id,
//               sender_role,
//               sender_name,
//               receiver_id: parsedReceiverId,
//               receiver_role,
//               message: messageData.message,
//               created_at: messageData.created_at.toISOString(),
//               is_read: false,
//             };
  
//             req.io.to(`${receiver_role}:${parsedReceiverId}`).emit('newMessage', notificationData);
//             res.json({ success: 'Message sent successfully', message_id: messageId });
//           });
//         }
//       );
//     });
//   };


  

// // Get messages for a user
// exports.getMessages = (req, res) => {
//    const user_role = req.user.role;
//   const user_id = req.user.jobSeeker_id || req.user.employer_id || req.user.id;
 
//   console.log("user_id",user_id);
//   const query = `
//     SELECT 
//       m.id, m.sender_id, m.sender_role, m.receiver_id, m.receiver_role, 
//       m.message, m.created_at, m.is_read, m.sender_name
//     FROM messages m
//     WHERE (m.receiver_id = ? AND m.receiver_role = ?) OR (m.sender_id = ? AND m.sender_role = ?)
//     ORDER BY m.created_at DESC
//   `;
//   req.db.query(query, [user_id, user_role, user_id, user_role], (err, result) => {
//     if (err) return res.status(500).json({ error: 'Database error', details: err.message });
//     res.status(200).json(result);
//   });
// };

// // Mark message as read
// exports.markMessageRead = (req, res) => {
//   const { message_id } = req.body;
//   const user_id =req.user.jobSeeker_id || req.user.employer_id || req.user.id;

 
//   req.db.query(
//     'UPDATE messages SET is_read = TRUE WHERE id = ? AND receiver_id = ?',
//     [message_id, user_id],
//     (err, result) => {
//       if (err) return res.status(500).json({ error: 'Database error', details: err.message });
//       if (result.affectedRows === 0) return res.status(404).json({ error: 'Message not found or unauthorized' });
//       res.json({ success: 'Message marked as read' });
//     }
//   );
// };

// exports.markAllMessagesRead = (req, res) => {
//   const user_id = req.user.jobSeeker_id || req.user.employer_id || req.user.id;
//   const user_role = req.user.role;

//   const query = `
//     UPDATE messages 
//     SET is_read = TRUE 
//     WHERE receiver_id = ? AND receiver_role = ? AND is_read = FALSE
//   `;
//   req.db.query(query, [user_id, user_role], (err, result) => {
//     if (err) {
//       console.error('Mark read error:', err);
//       return res.status(500).json({ error: 'Database error', details: err.message });
//     }
//     // Notify client to reset count
//     req.io.to(`${user_role}:${user_id}`).emit('messagesRead', { user_id, user_role });
//     res.json({ success: 'All messages marked as read', affectedRows: result.affectedRows });
//   });
// };



// exports.getUnreadMessageCount = (req, res) => {
//   const user_id = req.user.employer_id || req.user.jobSeeker_id || req.user.id;
//   const user_role = req.user.role;

//   const query = `
//     SELECT COUNT(*) AS unreadCount
//     FROM messages
//     WHERE receiver_id = ? AND receiver_role = ? AND is_read = FALSE
//   `;
//   req.db.query(query, [user_id, user_role], (err, result) => {
//     if (err) {
//       console.error('Unread count error:', err);
//       return res.status(500).json({ error: 'Database error', details: err.message });
//     }
//     res.json({ count: result[0].unreadCount });
//   });
// };








// // New: getEmployerInterviewAlerts
// exports.getEmployerInterviewAlerts = (req, res) => {
//   const employer_id = req.user.employer_id || req.user.jobSeeker_id || req.user.id;
//   if (req.user.role !== 'employer') {
//     return res.status(403).json({ error: 'Unauthorized: Employer role required' });
//   }

//   const query = `
//     SELECT 
//       i.id AS interview_id, i.job_id, i.jobseeker_id, i.interview_date, i.interview_type, i.status,
//       i.zoom_link, i.dress_code, i.document_url,
//       jp.Job_title AS jobTitle, jp.Company_name AS companyName,
//       s.full_name AS jobseekerName
//     FROM interviews i
//     JOIN job_postings jp ON i.job_id = jp.id
//     JOIN seekers s ON i.jobseeker_id = s.id
//     WHERE i.employer_id = ? AND i.status IN ('Scheduled', 'Confirmed')
//     ORDER BY i.interview_date ASC
//   `;
//   req.db.query(query, [employer_id], (err, result) => {
//     if (err) {
//       console.error('Interview alerts error:', err);
//       return res.status(500).json({ error: 'Database error', details: err.message });
//     }

//     result.forEach((alert) => {
//       if (alert.document_url && !isDriveUrl(alert.document_url)) {
//         alert.document_url = `${Base_Url}${alert.document_url}`;
//       }
//     })


     
//     res.json(result);
//   });
// };

// // New: getEmployerApplicationAlerts
// exports.getEmployerApplicationAlerts = (req, res) => {
//   const employer_id =  req.user.employer_id || req.user.jobSeeker_id || req.user.id;
//   if (req.user.role !== 'employer') {
//     return res.status(403).json({ error: 'Unauthorized: Employer role required' });
//   }

//   const query = `
//     SELECT 
//       ja.id AS application_id, ja.job_id, ja.jobseeker_id, ja.created_at AS appliedDate,
//       ja.status, ja.full_name AS applicantName,
//       jp.Job_title AS jobTitle, jp.Company_name AS companyName
//     FROM job_applications ja
//     JOIN job_postings jp ON ja.job_id = jp.id
//     WHERE jp.employer_id = ? AND ja.status = 'Pending'
//     ORDER BY ja.created_at DESC
//     LIMIT 10
//   `;
//   req.db.query(query, [employer_id], (err, result) => {
//     if (err) {
//       console.error('Application alerts error:', err);
//       return res.status(500).json({ error: 'Database error', details: err.message });
//     }
//     res.json(result);
//   });
// };

// // New: getEmployerInterviewCount
// exports.getEmployerInterviewCount = (req, res) => {
//   const employer_id = req.user.jobSeeker_id || req.user.employer_id || req.user.id;
//   if (req.user.role !== 'employer') {
//     return res.status(403).json({ error: 'Unauthorized: Employer role required' });
//   }

//   const query = `
//     SELECT COUNT(*) AS interviewCount
//     FROM interviews i
//     JOIN job_postings jp ON i.job_id = jp.id
//     WHERE jp.employer_id = ? AND i.status IN ('Scheduled', 'Confirmed')
//   `;
//   req.db.query(query, [employer_id], (err, result) => {
//     if (err) {
//       console.error('Interview count error:', err);
//       return res.status(500).json({ error: 'Database error', details: err.message });
//     }
//     res.json({ count: result[0].interviewCount });
//   });
// };

// // New: getEmployerApplicationCount
// exports.getEmployerApplicationCount = (req, res) => {
//   const employer_id = req.user.jobSeeker_id || req.user.employer_id || req.user.id;
//   if (req.user.role !== 'employer') {
//     return res.status(403).json({ error: 'Unauthorized: Employer role required' });
//   }

//   const query = `
//     SELECT COUNT(*) AS applicationCount
//     FROM job_applications ja
//     JOIN job_postings jp ON ja.job_id = jp.id
//     WHERE jp.employer_id = ? AND ja.status = 'Pending'
//   `;
//   req.db.query(query, [employer_id], (err, result) => {
//     if (err) {
//       console.error('Application count error:', err);
//       return res.status(500).json({ error: 'Database error', details: err.message });
//     }
//     res.json({ count: result[0].applicationCount });
//   });
// };


const jwt = require('jsonwebtoken');
const Base_Url = require('../config/Base_Url');

const isDriveUrl = (url) => url && url.startsWith("https://drive.google.com/");

exports.handleJobSeeker = async (req, res) => {
  const { full_name, email, phone, password, job_title, skills, experience_level, location_preference } = req.body;
  const resume = req.files?.resume?.[0]?.path || null;
  const profile = req.files?.profile?.[0]?.path || null;

  if (!full_name || !email || !phone || !password || !resume || !profile) {
    return res.status(400).json({ error: 'Required fields missing (full_name, email, phone, password, resume, profile)' });
  }

  const validExperienceLevels = ['Entry-level', 'Mid-level', 'Senior', 'Executive'];
  if (experience_level && !validExperienceLevels.includes(experience_level)) {
    return res.status(400).json({ error: 'Invalid experience level' });
  }

  const seekerData = {
    full_name,
    email,
    phone,
    password,
    role: 'seeker',
    job_title: job_title || null,
    skills: skills || null,
    experience_level: experience_level || 'Entry-level',
    location_preference: location_preference || null,
    resume,
    profile,
    education: null,
    work_experience: null,
    bio: null,
    certifications: null,
    linkedin: null,
    github: null,
    availability: null,
  };

  try {
    const { insertIntoDatabase } = require('../utils/helpers');
    const { insertId } = await insertIntoDatabase('seekers', seekerData, req.db);
    const token = jwt.sign({ id: insertId, jobSeeker_id: insertId, role: 'seeker' }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Job seeker registered',
      token,
      userId: insertId,
    });
  } catch (err) {
    console.error('❌ handleJobSeeker error:', err);
    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'Email already exists' });
    res.status(500).json({ error: 'Error signing up', details: err.message });
  }
};

exports.handleEmployer = async (req, res) => {
  const { full_name, email, phone, password, company_name, industry, company_size, job_description } = req.body;
  const logo = req.files?.logo?.[0]?.path || null;

  if (!full_name || !email || !phone || !password || !company_name || !industry || !company_size || !job_description) {
    return res.status(400).json({ error: 'Required fields missing' });
  }

  const employerData = {
    full_name,
    email,
    phone,
    password,
    company_name,
    industry,
    company_size,
    job_description,
    logo,
  };

  try {
    const { insertIntoDatabase } = require('../utils/helpers');
    const { insertId } = await insertIntoDatabase('employers', employerData, req.db);
    const token = jwt.sign({ id: insertId, employer_id: insertId, role: 'employer' }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Employer registered',
      token,
      userId: insertId,
    });
  } catch (err) {
    console.error('❌ handleEmployer error:', err);
    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'Email already exists' });
    res.status(500).json({ error: 'Error signing up', details: err.message });
  }
};

exports.createJobPost = async (req, res) => {
  const {
    Job_title,
    Company_name,
    Location,
    Employment_type,
    Salary_range,
    job_description,
    Key_responsibilities,
    Requirements,
    Preferred_qualifications,
    Benefits,
    Application_deadline,
    How_to_apply,
    employer_id,
  } = req.body;

  if (!Job_title || !Company_name || !Location) {
    return res.status(400).json({ error: 'Job title, company name, and location are required' });
  }

  const jobData = {
    Job_title,
    Company_name,
    Location,
    Employment_type,
    Salary_range,
    job_description,
    Key_responsibilities,
    Requirements,
    Preferred_qualifications,
    Benefits,
    Application_deadline,
    How_to_apply,
    employer_id,
  };

  try {
    const { insertIntoDatabase } = require('../utils/helpers');
    const { insertId } = await insertIntoDatabase('job_postings', jobData, req.db);
    res.json({ message: 'Job post created successfully', jobId: insertId });
  } catch (err) {
    console.error('❌ createJobPost error:', err);
    res.status(500).json({ error: 'Error creating job post', details: err.message });
  }
};

exports.getJobListings = async (req, res) => {
  const { search, location, employmentType, salaryRange, sortBy, page = 1, limit = 50 } = req.query;
  const offset = (page - 1) * limit;

  let query = `
    SELECT jp.*, e.logo AS company_logo
    FROM job_postings jp
    JOIN employers e ON jp.employer_id = e.employer_id
    WHERE 1=1
  `;
  const queryParams = [];

  if (search) {
    query += ` AND (jp.Job_title LIKE ? OR jp.Company_name LIKE ? OR jp.Location LIKE ?)`;
    queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (location) query += ` AND jp.Location = ?`, queryParams.push(location);
  if (employmentType) query += ` AND jp.Employment_type = ?`, queryParams.push(employmentType);
  if (salaryRange) {
    const [minSalary, maxSalary] = salaryRange.split('-').map(Number);
    query += ` AND jp.Salary_range BETWEEN ? AND ?`, queryParams.push(minSalary, maxSalary);
  }
  if (sortBy === 'date') query += ` ORDER BY jp.created_at DESC`;
  else if (sortBy === 'salary') query += ` ORDER BY jp.Salary_range DESC`;
  else if (sortBy === 'title') query += ` ORDER BY jp.Job_title ASC`;
  query += ` LIMIT ? OFFSET ?`;
  queryParams.push(Number(limit), Number(offset));

  try {
    const [results] = await req.db.query(query, queryParams);
    results.forEach((job) => {
      if (job.company_logo && !isDriveUrl(job.company_logo)) {
        job.company_logo = `${Base_Url}${job.company_logo}`;
      }
    });

    const countQuery = `SELECT COUNT(*) as total FROM job_postings jp JOIN employers e ON jp.employer_id = e.employer_id WHERE 1=1`;
    const countParams = queryParams.slice(0, -2);
    const [countResult] = await req.db.query(countQuery, countParams);
    const totalJobs = countResult[0].total;
    const totalPages = Math.ceil(totalJobs / limit);

    res.json([
      results,
      {
        totalJobs,
        totalPages,
        currentPage: Number(page),
        jobsPerPage: Number(limit),
      },
    ]);
  } catch (err) {
    console.error('❌ getJobListings error:', err);
    res.status(500).json({ error: 'Error fetching job postings', details: err.message });
  }
};

exports.getEmployerJobs = async (req, res) => {
  const { employer_id } = req.query;

  if (!employer_id) {
    return res.status(400).json({ error: 'Employer ID is required' });
  }

  try {
    const [results] = await req.db.query(
      `SELECT jp.*, e.logo AS company_logo
       FROM job_postings jp
       JOIN employers e ON jp.employer_id = e.employer_id
       WHERE jp.employer_id = ?`,
      [employer_id]
    );

    results.forEach((job) => {
      if (job.company_logo && !isDriveUrl(job.company_logo)) {
        job.company_logo = `${Base_Url}${job.company_logo}`;
      }
    });

    res.status(200).json(results);
  } catch (err) {
    console.error('❌ Error fetching employer jobs:', err);
    res.status(500).json({ error: 'Error fetching employer jobs', details: err.message });
  }
};

exports.getTotalJobs = async (req, res) => {
  try {
    const [result] = await req.db.query('SELECT COUNT(*) AS total_jobs FROM job_postings');
    const totalJobs = result[0].total_jobs;
    res.json({ total_jobs: totalJobs });
  } catch (err) {
    console.error('❌ Error fetching job count:', err);
    res.status(500).json({ message: 'Error fetching job count', details: err.message });
  }
};

exports.getTotalEmployers = async (req, res) => {
  try {
    const [result] = await req.db.query('SELECT COUNT(*) AS total_employers FROM employers');
    const totalEmployers = result[0].total_employers;
    res.json({ total_employers: totalEmployers });
  } catch (err) {
    console.error('❌ Error fetching employer count:', err);
    res.status(500).json({ message: 'Error fetching employer count', details: err.message });
  }
};

exports.getJobPost = async (req, res) => {
  const { id } = req.params;

  try {
    const [results] = await req.db.query('SELECT * FROM job_postings WHERE id = ?', [id]);
    if (results.length === 0) {
      return res.status(404).json({ error: 'Job post not found' });
    }
    res.status(200).json(results[0]);
  } catch (err) {
    console.error('❌ Error fetching job post:', err);
    res.status(500).json({ error: 'Error fetching job post', details: err.message });
  }
};

exports.editJobPost = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const [result] = await req.db.query('UPDATE job_postings SET ? WHERE id = ?', [updatedData, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Job post not found' });
    }
    res.json({ message: 'Job post updated successfully' });
  } catch (err) {
    console.error('❌ Error updating job post:', err);
    res.status(500).json({ error: 'Error updating job post', details: err.message });
  }
};

exports.deleteJobPost = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await req.db.query('DELETE FROM job_postings WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Job post not found' });
    }
    res.json({ message: 'Job post deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting job post:', err);
    res.status(500).json({ error: 'Error deleting job post', details: err.message });
  }
};





 









// exports.applyJob = async (req, res) => {
//   const { job_id, jobSeeker_id, fullName, email, phone, coverLetter, linkedIn, portfolio } = req.body;
//    const resume = req.file?.path || null;

//   if (!job_id || !jobSeeker_id || !fullName || !email || !phone ) {
//     return res.status(400).json({ 
//       error: "Required fields missing",
//       missingFields: { 
//         job_id: !!job_id,
//         jobSeeker_id: !!jobSeeker_id,
//         fullName: !!fullName,
//         email: !!email,
//         phone: !!phone
//        }
//     });
//   }
  
//   console.log("request form req.user",req.user);
  
//   const applicationData = {
//     job_id,
//     jobseeker_id: jobSeeker_id,
//     full_name: fullName,
//     email,
//     resume,
//     cover_letter: coverLetter,
//     linkedIn,
//     phone,
//     portfolio,
//   };

//   try {
//     const { insertIntoDatabase } = require("../utils/helpers");
//     const { insertId } = await insertIntoDatabase("job_applications", applicationData, req.db);

//     res.status(201).json({
//       message: "Job application submitted successfully",
//       applicationId: insertId,
//     });
//   } catch (err) {
//     console.error("❌ applyJob error:", err);
//     if (err.code === "ER_DUP_ENTRY") return res.status(400).json({ error: "Application already submitted" });
//     if (err.code === "ER_BAD_NULL_ERROR") return res.status(400).json({ error: "Required field missing", details: err.sqlMessage });
//     res.status(500).json({ error: "Error submitting application", details: err.message });
//   }
// };






exports.applyJob = async (req, res) => {
  const { job_id, jobSeeker_id, fullName, email, phone, coverLetter, linkedIn, portfolio } = req.body;
  const resume = req.file?.url || null; // Use req.file.url instead of req.file.path

  console.log("applyJob - Incoming Request:", {
    job_id,
    jobSeeker_id,
    fullName,
    email,
    phone,
    resume,
    coverLetter,
    linkedIn,
    portfolio,
    user: req.user,
  });

  if (!job_id || !jobSeeker_id || !fullName || !email || !phone || !resume) {
    console.error("applyJob - Missing required fields:", {
      job_id: !!job_id,
      jobSeeker_id: !!jobSeeker_id,
      fullName: !!fullName,
      email: !!email,
      phone: !!phone,
      resume: !!resume,
    });
    return res.status(400).json({
      error: "Required fields missing",
      missingFields: {
        job_id: !!job_id,
        jobSeeker_id: !!jobSeeker_id,
        fullName: !!fullName,
        email: !!email,
        phone: !!phone,
        resume: !!resume,
      },
    });
  }

  console.log("applyJob - req.user:", req.user);

  if (!req.user || req.user.jobSeeker_id !== parseInt(jobSeeker_id) || req.user.role !== "seeker") {
    console.error("applyJob - Authentication error:", { user: req.user, jobSeeker_id });
    return res.status(403).json({ error: "Unauthorized: Valid seeker authentication required" });
  }

  const applicationData = {
    job_id,
    jobseeker_id: jobSeeker_id,
    full_name: fullName,
    email,
    resume,
    cover_letter: coverLetter || null,
    linkedIn: linkedIn || null,
    phone,
    portfolio: portfolio || null,
    status: "pending",
    applied_at: new Date(),
  };

  console.log("applyJob - Inserting into job_applications:", applicationData);

  try {
    const { insertIntoDatabase } = require("../utils/helpers");
    const { insertId } = await insertIntoDatabase("job_applications", applicationData, req.db);

    console.log("applyJob - Success:", { applicationId: insertId });

    res.status(201).json({
      message: "Job application submitted successfully",
      applicationId: insertId,
    });
  } catch (err) {
    console.error("applyJob - Error:", err);
    if (err.code === "ER_DUP_ENTRY") return res.status(400).json({ error: "Application already submitted" });
    if (err.code === "ER_BAD_NULL_ERROR") return res.status(400).json({ error: "Required field missing", details: err.sqlMessage });
    res.status(500).json({ error: "Error submitting application", details: err.message });
  }
};





exports.updateApplicationStatus = async (req, res) => {
  const { Job_id, status, applicant_Id } = req.body;

  if (!Job_id || !status || !applicant_Id) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const validStatuses = ['Pending', 'Accepted', 'Interview', 'Hired', 'Rejected'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  try {
    const [selectResult] = await req.db.query('SELECT status FROM job_applications WHERE job_id = ? AND jobseeker_id = ?', [Job_id, applicant_Id]);
    if (selectResult.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const [result] = await req.db.query(
      'UPDATE job_applications SET status = ? WHERE job_id = ? AND jobseeker_id = ?',
      [status, Job_id, applicant_Id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Application not found or no changes made' });
    }

    res.json({ success: 'Status updated successfully' });
  } catch (err) {
    console.error('❌ Error updating status:', err);
    res.status(500).json({ error: 'Error updating status', details: err.message });
  }
};

exports.scheduleInterview = async (req, res) => {
  const { Job_id, applicant_Id, interview_date, interview_type, interview_location, phone_number, zoom_link, dress_code } = req.body;
  const employer_id = parseInt(req.user.employer_id, 10);

  if (!Job_id || !applicant_Id || !interview_date || !interview_type || isNaN(employer_id)) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const jobIdInt = parseInt(Job_id, 10);
  const applicantIdInt = parseInt(applicant_Id, 10);
  if (isNaN(jobIdInt) || isNaN(applicantIdInt)) {
    return res.status(400).json({ error: 'Invalid IDs' });
  }

  const validInterviewTypes = ['In-Person', 'Phone Call', 'Video Call'];
  if (!validInterviewTypes.includes(interview_type)) {
    return res.status(400).json({ error: 'Invalid interview type' });
  }
  if (interview_type === 'In-Person' && (!interview_location || interview_location.trim() === '')) {
    return res.status(400).json({ error: 'Interview location required' });
  }
  if (interview_type === 'Phone Call' && (!phone_number || !/^\+?\d{7,15}$/.test(phone_number))) {
    return res.status(400).json({ error: 'Invalid phone number' });
  }
  if (interview_type === 'Video Call' && (!zoom_link || !/^https?:\/\/.+\..+/.test(zoom_link))) {
    return res.status(400).json({ error: 'Invalid Zoom link' });
  }

  const interviewDateObj = new Date(interview_date);
  if (isNaN(interviewDateObj.getTime()) || interviewDateObj < new Date()) {
    return res.status(400).json({ error: 'Invalid date' });
  }

   const document_url = req.file?.url || null;

  const interviewData = {
    job_id: jobIdInt,
    jobseeker_id: applicantIdInt,
    employer_id,
    interview_date: interviewDateObj,
    interview_type,
    interview_location: interview_type === 'In-Person' ? interview_location.trim() : null,
    phone_number: interview_type === 'Phone Call' ? phone_number.trim() : null,
    zoom_link: interview_type === 'Video Call' ? zoom_link.trim() : null,
    dress_code: dress_code ? dress_code.trim() : null,
    document_url,
    status: 'Scheduled',
    created_at: new Date(),
  };

  try {
    const [job] = await req.db.query(
      'SELECT Job_title, Company_name FROM job_postings WHERE id = ? AND employer_id = ?',
      [jobIdInt, employer_id]
    );
    if (job.length === 0) {
      return res.status(403).json({ error: 'Unauthorized or job not found' });
    }

    const jobDetails = job[0];

    const [existingInterview] = await req.db.query(
      'SELECT id FROM interviews WHERE job_id = ? AND jobseeker_id = ? AND status = ?',
      [jobIdInt, applicantIdInt,"Scheduled"]
    );
    if (existingInterview.length > 0) {
      return res.status(409).json({ error: 'An interview is already scheduled' });
    }

    const [result] = await req.db.query('INSERT INTO interviews SET ?', interviewData);
    const interviewId = result.insertId;

    await req.db.query(
      'UPDATE job_applications SET status = ? WHERE job_id = ? AND jobseeker_id = ?',
      ["Interview",jobIdInt, applicantIdInt]
    );

    const notificationData = {
      interview_id: interviewId,
      job_id: jobIdInt,
      interview_date: interviewDateObj.toISOString(),
      interview_type,
      interview_location: interviewData.interview_location,
      phone_number: interviewData.phone_number,
      zoom_link: interviewData.zoom_link,
      dress_code: interviewData.dress_code || 'Not specified',
      document_url,
      jobTitle: jobDetails.Job_title,
      companyName: jobDetails.Company_name,
      scheduledAt: interviewData.created_at.toISOString(),
    };

    req.io.to(applicantIdInt.toString()).emit('interviewScheduled', notificationData);

    res.status(201).json({
      success: 'Interview scheduled successfully',
      interview_id: interviewId,
      interview_date: interviewDateObj.toISOString(),
      document_url,
    });
  } catch (err) {
    console.error('❌ scheduleInterview error:', err);
    res.status(500).json({ error: 'Failed to schedule interview', details: err.message });
  }
};


exports.getJobApplicants = async (req, res) => {
  const { Job_id } = req.query;
  const employerId = req.user.employer_id;

  if (!Job_id || !employerId) {
    return res.status(400).json({ error: "Job ID and Employer ID are required" });
  }

  try {
    const [result] = await req.db.query(
      `SELECT 
         ja.job_id,
         ja.full_name,
         ja.email,
         ja.jobseeker_id AS ApplicantId,
         ja.resume AS applicantResume,
         ja.cover_letter AS coverLetter,
         ja.linkedin AS applicantLinkedIn,
         ja.portfolio AS ApplicantPortfolio,
         ja.created_at AS appliedDate,
         ja.status,
         s.profile AS ApplicantProfile,
         i.interview_date AS interviewScheduled
       FROM job_applications ja
       JOIN job_postings jp ON ja.job_id = jp.id
       JOIN seekers s ON ja.jobseeker_id = s.id
       LEFT JOIN interviews i ON ja.job_id = i.job_id AND ja.jobseeker_id = i.jobseeker_id AND i.status = 'Scheduled'
       WHERE ja.job_id = ? AND jp.employer_id = ?
       ORDER BY ja.created_at DESC`,
      [Job_id, employerId]
    );

    result.forEach((job) => {
      if (job.ApplicantProfile && !isDriveUrl(job.ApplicantProfile)) {
        job.ApplicantProfile = `${Base_Url}${job.ApplicantProfile}`;
      }
      if (job.applicantResume && !isDriveUrl(job.applicantResume)) {
        job.applicantResume = `${Base_Url}${job.applicantResume}`;
      }
    });

    res.status(200).json(result || []);
  } catch (err) {
    console.error('❌ getJobApplicants error:', err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
};

exports.getAppliedJobs = async (req, res) => {
  const { jobSeeker_id } = req.query;

  if (!jobSeeker_id) {
    return res.status(400).json({ error: "JobSeeker ID is required" });
  }

  try {
    const [result] = await req.db.query('SELECT job_id FROM job_applications WHERE jobSeeker_id = ?', [jobSeeker_id]);
    res.json(result.map(job => job.job_id));
  } catch (err) {
    console.error('❌ getAppliedJobs error:', err);
    res.status(500).json({ error: "Error fetching applied jobs", details: err.message });
  }
};

exports.getMyApplication = async (req, res) => {
  const { jobSeeker_id } = req.query;

  if (!jobSeeker_id) {
    return res.status(400).json({ error: "JobSeeker ID is required" });
  }

  const jobSeekerId = parseInt(jobSeeker_id, 10);
  if (isNaN(jobSeekerId)) {
    return res.status(400).json({ error: "Invalid JobSeeker ID" });
  }

  try {
    const [result] = await req.db.query(
      `SELECT 
         jp.id,
         jp.Job_title AS title,
         jp.Company_name AS companyName,
         jp.Location AS location,
         jp.Employment_type AS employmentType,
         jp.job_description AS description,
         jp.salary_range AS salaryRange,   
         jp.created_at AS postedDate,     
         ja.created_at AS appliedDate,
         ja.full_name AS applicantName,
         ja.email AS applicantEmail,
         ja.resume AS applicantResume,
         ja.cover_letter AS coverLetter,  
         ja.linkedIn AS applicantLinkedIn,
         ja.portfolio AS ApplicantPortfolio,  
         ja.status AS applicationStatus,
         i.interview_date AS interviewDate,
         i.status AS interviewStatus,
         e.logo AS companyLogo
       FROM job_applications ja
       JOIN job_postings jp ON ja.job_id = jp.id
       JOIN employers e ON jp.employer_id = e.employer_id
       LEFT JOIN interviews i ON ja.job_id = i.job_id AND ja.jobseeker_id = i.jobseeker_id
       WHERE ja.jobSeeker_id = ?
       ORDER BY ja.created_at DESC`,
      [jobSeekerId]
    );

    result.forEach((job) => {
      if (job.companyLogo && !isDriveUrl(job.companyLogo)) {
        job.companyLogo = `${Base_Url}${job.companyLogo}`;
      }
      if (job.applicantResume && !isDriveUrl(job.applicantResume)) {
        job.applicantResume = `${Base_Url}${job.applicantResume}`;
      }
    });

    res.status(200).json(result);
  } catch (err) {
    console.error('❌ getMyApplication error:', err);
    res.status(500).json({ error: "Error fetching applied jobs", details: err.message });
  }
};

exports.withdrawApplication = async (req, res) => {
  const { job_id, jobSeeker_id } = req.body;

  if (!job_id || !jobSeeker_id) {
    return res.status(400).json({ error: 'Job ID and JobSeeker ID are required' });
  }

  try {
    const [result] = await req.db.query('DELETE FROM job_applications WHERE job_id = ? AND jobSeeker_id = ?', [job_id, jobSeeker_id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.json({ message: 'Application withdrawn successfully' });
  } catch (err) {
    console.error('❌ withdrawApplication error:', err);
    res.status(500).json({ error: 'Error withdrawing application', details: err.message });
  }
};

 

exports.getInterviewCount = async (req, res) => {
  console.log("req.user:", req.user); // Debug

  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized: No user authenticated" });
  }

  const jobseeker_id = req.user.jobSeeker_id || req.user.id;
 
  if (!jobseeker_id) {
    return res.status(400).json({ error: "Invalid user: jobseeker_id not found" });
  }

  if (req.user.role !== "seeker") {
    return res.status(403).json({ error: "Unauthorized: Seeker role required" });
  }

  try {
    const [result] = await req.db.query(
      "SELECT COUNT(*) AS interviewCount FROM interviews WHERE jobseeker_id = ? AND status = ?",
      [jobseeker_id, "Scheduled"]
    );
    res.json({ interviewCount: result[0].interviewCount });
  } catch (err) {
    console.error("❌ getInterviewCount error:", err);
    res.status(500).json({ error: "Error fetching interview count", details: err.message });
  }
};






exports.getInterviewAlerts = async (req, res) => {
  const jobSeeker_id = req.user.jobSeeker_id || req.user.id;

   if (req.user.role !== 'seeker') {
    return res.status(403).json({ error: 'Unauthorized: Seeker role required' });
  }

  try {
    const [result] = await req.db.query(
      `SELECT 
         i.job_id, i.interview_date, i.interview_type, i.status AS interviewStatus,
         i.zoom_link, i.dress_code, i.document_url,
         jp.Job_title AS jobTitle, jp.Company_name AS companyName
       FROM interviews i
       JOIN job_postings jp ON i.job_id = jp.id
       WHERE i.jobseeker_id = ? AND i.status = 'Scheduled'
       ORDER BY i.interview_date ASC`,
      [jobSeeker_id]
    );

    result.forEach((alert) => {
      if (alert.document_url && !isDriveUrl(alert.document_url)) {
        alert.document_url = `${Base_Url}${alert.document_url}`;
      }
    });

    res.json(result);
  } catch (err) {
    console.error('❌ getInterviewAlerts error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

exports.getInterviews = async (req, res) => {
  const jobSeeker_id = parseInt(req.user.jobSeeker_id || req.user.id || req.query.jobSeeker_id, 10);

  if (isNaN(jobSeeker_id)) {
    return res.status(400).json({ error: 'Invalid JobSeeker ID' });
  }

  try {
    const [results] = await req.db.query(
      `SELECT 
         i.id,
         i.job_id,
         i.jobseeker_id,
         i.employer_id,
         i.interview_date,
         i.interview_type,
         i.interview_location,
         i.phone_number,
         i.zoom_link,
         i.dress_code,
         i.document_url,
         i.status,
         i.created_at,
         jp.Job_title AS jobTitle,
         jp.Company_name AS companyName,
         e.logo AS companyLogo
       FROM interviews i
       JOIN job_postings jp ON i.job_id = jp.id
       JOIN employers e ON i.employer_id = e.employer_id
       WHERE i.jobseeker_id = ? AND i.status IN ('Scheduled', 'Confirmed', 'Declined')
       ORDER BY i.interview_date ASC`,
      [jobSeeker_id]
    );

    results.forEach((interview) => {
      if (interview.companyLogo && !isDriveUrl(interview.companyLogo)) {
        interview.companyLogo = `${Base_Url}${interview.companyLogo}`;
      }
      if (interview.document_url && !isDriveUrl(interview.document_url)) {
        interview.document_url = `${Base_Url}${interview.document_url}`;
      }
    });

    res.status(200).json(results);
  } catch (err) {
    console.error('❌ getInterviews error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

exports.confirmInterview = async (req, res) => {
  const { interview_id, response } = req.body;
  const jobSeeker_id = parseInt(req.user.jobSeeker_id || req.user.id, 10);

  if (!interview_id || !response) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!['Confirmed', 'Declined'].includes(response)) {
    return res.status(400).json({ error: 'Invalid response' });
  }

  try {
    const [result] = await req.db.query(
      'UPDATE interviews SET status = ? WHERE id = ? AND jobseeker_id = ? AND status = ?',
      [response, interview_id, jobSeeker_id,"Scheduled"]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Interview not found or already responded' });
    }

    const [interview] = await req.db.query('SELECT employer_id, job_id FROM interviews WHERE id = ?', [interview_id]);
    if (!interview[0]) {
      return res.status(500).json({ error: 'Notification error' });
    }

    const employer_id = interview[0].employer_id;
    const job_id = interview[0].job_id;

    const [job] = await req.db.query('SELECT Job_title, Company_name FROM job_postings WHERE id = ?', [job_id]);
    if (!job[0]) {
      return res.status(500).json({ error: 'Notification error' });
    }

    const notificationData = {
      interview_id,
      response,
      jobseeker_id: jobSeeker_id,
      jobTitle: job[0].Job_title,
      companyName: job[0].Company_name,
      timestamp: new Date().toISOString(),
    };

    req.io.to(`employer:${employer_id}`).emit('interviewResponse', notificationData);
    res.json({ success: `${response} successfully` });
  } catch (err) {
    console.error('❌ confirmInterview error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

exports.getEmployerInterviews = async (req, res) => {
  const employer_id = parseInt(req.user.employer_id, 10);

  if (req.user.role !== 'employer') {
    return res.status(403).json({ error: 'Unauthorized: Employer role required' });
  }
  if (isNaN(employer_id)) {
    return res.status(401).json({ error: 'Invalid employer ID' });
  }

  try {
    const [results] = await req.db.query(
      `SELECT 
         i.id AS interview_id,
         i.job_id,
         i.jobseeker_id AS jobSeekerId,
         i.interview_date,
         i.interview_type,
         i.interview_location,
         i.phone_number,
         i.zoom_link,
         i.dress_code,
         i.document_url,
         i.status,
         i.created_at,
         jp.Job_title AS jobTitle,
         jp.Company_name AS companyName,
         s.full_name AS jobSeekerName,
         s.email AS jobSeekerEmail,
         s.phone AS jobSeekerPhone,
         s.bio AS jobSeekerBio,
         s.skills AS jobSeekerSkills,
         s.education AS jobSeekerEducation,
         s.work_experience AS jobSeekerExperience,
         s.certifications AS jobSeekerCertifications,
         s.linkedin AS jobSeekerLinkedIn,
         s.github AS jobSeekerGitHub,
         s.availability AS jobSeekerAvailability,
         s.profile AS jobSeekerProfilePicture,
         ja.resume AS jobSeekerResume
       FROM interviews i
       JOIN job_postings jp ON i.job_id = jp.id
       JOIN seekers s ON i.jobseeker_id = s.id
       JOIN job_applications ja ON i.job_id = ja.job_id AND i.jobseeker_id = ja.jobseeker_id
       WHERE i.employer_id = ?
       ORDER BY i.interview_date ASC`,
      [employer_id]
    );

    results.forEach((interview) => {
      if (interview.jobSeekerResume && !isDriveUrl(interview.jobSeekerResume)) {
        interview.jobSeekerResume = `${Base_Url}${interview.jobSeekerResume}`;
      }
      if (interview.document_url && !isDriveUrl(interview.document_url)) {
        interview.document_url = `${Base_Url}${interview.document_url}`;
      }
      if (interview.jobSeekerProfilePicture && !isDriveUrl(interview.jobSeekerProfilePicture)) {
        interview.jobSeekerProfilePicture = `${Base_Url}${interview.jobSeekerProfilePicture}`;
      }
    });

    res.status(200).json(results);
  } catch (err) {
    console.error('❌ getEmployerInterviews error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

exports.getInterviewDetails = async (req, res) => {
  const { interview_id } = req.query;
  const employer_id = parseInt(req.user.employer_id, 10);

  if (!interview_id) {
    return res.status(400).json({ error: 'Missing interview_id' });
  }

  try {
    const [results] = await req.db.query(
      `SELECT 
         i.*,
         jp.Job_title AS jobTitle,
         jp.Company_name AS companyName,
         s.full_name AS jobseekerName,
         s.email AS jobseekerEmail,
         ja.resume AS jobseekerResume
       FROM interviews i
       JOIN job_postings jp ON i.job_id = jp.id
       JOIN seekers s ON i.jobseeker_id = s.id
       JOIN job_applications ja ON i.job_id = ja.job_id AND i.jobseeker_id = ja.jobseeker_id
       WHERE i.id = ? AND i.employer_id = ?`,
      [interview_id, employer_id]
    );

    if (results.length === 0) {
      return res.status(404).json({ error: 'Interview not found or unauthorized' });
    }

    const interview = results[0];
    if (interview.jobseekerResume && !isDriveUrl(interview.jobseekerResume)) {
      interview.jobseekerResume = `${Base_Url}${interview.jobseekerResume}`;
    }
    if (interview.document_url && !isDriveUrl(interview.document_url)) {
      interview.document_url = `${Base_Url}${interview.document_url}`;
    }

    res.status(200).json(interview);
  } catch (err) {
    console.error('❌ getInterviewDetails error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  const sender_id = req.user.jobSeeker_id || req.user.employer_id || req.user.id;
  const { receiver_id, receiver_role, message } = req.body;
  const sender_role = req.user.role;

  if (!receiver_id || !receiver_role || !message) {
    return res.status(400).json({ error: 'Missing required fields: receiver_id, receiver_role, message' });
  }

  const parsedReceiverId = parseInt(receiver_id);
  if (isNaN(parsedReceiverId)) {
    return res.status(400).json({ error: 'Invalid receiver_id: must be a number' });
  }

  if (!['employer', 'seeker'].includes(receiver_role)) {
    return res.status(400).json({ error: 'Invalid receiver_role: must be "employer" or "seeker"' });
  }

  if (!message.trim()) {
    return res.status(400).json({ error: 'Message cannot be empty' });
  }

  try {
    const senderNameQuery = sender_role === 'seeker'
      ? 'SELECT full_name AS name FROM seekers WHERE id = ?'
      : 'SELECT company_name AS name FROM employers WHERE employer_id = ?';
    const [senderResult] = await req.db.query(senderNameQuery, [sender_id]);
    if (!senderResult[0]) {
      return res.status(404).json({ error: 'Sender not found' });
    }

    const sender_name = senderResult[0].name;
    const receiverTable = receiver_role === 'seeker' ? 'seekers' : 'employers';
    const receiverNameField = receiver_role === 'seeker' ? 'full_name' : 'company_name';
    const receiverIdField = receiver_role === 'seeker' ? 'id' : 'employer_id';
    const [receiverResult] = await req.db.query(
      `SELECT ${receiverNameField} AS name FROM ${receiverTable} WHERE ${receiverIdField} = ?`,
      [parsedReceiverId]
    );
    if (!receiverResult[0]) {
      return res.status(404).json({ error: `Receiver ${receiver_role} ID ${parsedReceiverId} not found` });
    }

    const messageData = {
      sender_id,
      sender_role,
      receiver_id: parsedReceiverId,
      receiver_role,
      message: message.trim(),
      sender_name,
      created_at: new Date(),
      is_read: false,
    };

    const [result] = await req.db.query('INSERT INTO messages SET ?', messageData);
    const messageId = result.insertId;

    const notificationData = {
      id: messageId,
      sender_id,
      sender_role,
      sender_name,
      receiver_id: parsedReceiverId,
      receiver_role,
      message: messageData.message,
      created_at: messageData.created_at.toISOString(),
      is_read: false,
    };

    req.io.to(`${receiver_role}:${parsedReceiverId}`).emit('newMessage', notificationData);
    res.json({ success: 'Message sent successfully', message_id: messageId });
  } catch (err) {
    console.error('❌ sendMessage error:', err);
    res.status(500).json({ error: 'Failed to send message', details: err.message });
  }
};

exports.getMessages = async (req, res) => {
  const user_role = req.user.role;
  const user_id = req.user.jobSeeker_id || req.user.employer_id || req.user.id;

  try {
    const [result] = await req.db.query(
      `SELECT 
         m.id, m.sender_id, m.sender_role, m.receiver_id, m.receiver_role, 
         m.message, m.created_at, m.is_read, m.sender_name
       FROM messages m
       WHERE (m.receiver_id = ? AND m.receiver_role = ?) OR (m.sender_id = ? AND m.sender_role = ?)
       ORDER BY m.created_at DESC`,
      [user_id, user_role, user_id, user_role]
    );
    res.status(200).json(result);
  } catch (err) {
    console.error('❌ getMessages error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

exports.markMessageRead = async (req, res) => {
  const { message_id } = req.body;
  const user_id = req.user.jobSeeker_id || req.user.employer_id || req.user.id;

  try {
    const [result] = await req.db.query(
      'UPDATE messages SET is_read = TRUE WHERE id = ? AND receiver_id = ?',
      [message_id, user_id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Message not found or unauthorized' });
    }
    res.json({ success: 'Message marked as read' });
  } catch (err) {
    console.error('❌ markMessageRead error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

exports.markAllMessagesRead = async (req, res) => {
  const user_id = req.user.jobSeeker_id || req.user.employer_id || req.user.id;
  const user_role = req.user.role;

  try {
    const [result] = await req.db.query(
      'UPDATE messages SET is_read = TRUE WHERE receiver_id = ? AND receiver_role = ? AND is_read = FALSE',
      [user_id, user_role]
    );

    req.io.to(`${user_role}:${user_id}`).emit('messagesRead', { user_id, user_role });
    res.json({ success: 'All messages marked as read', affectedRows: result.affectedRows });
  } catch (err) {
    console.error('❌ markAllMessagesRead error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

exports.getUnreadMessageCount = async (req, res) => {
  const user_id = req.user.jobSeeker_id || req.user.employer_id || req.user.id;
  const user_role = req.user.role;

  try {
    const [result] = await req.db.query(
      'SELECT COUNT(*) AS unreadCount FROM messages WHERE receiver_id = ? AND receiver_role = ? AND is_read = FALSE',
      [user_id, user_role]
    );
    res.json({ count: result[0].unreadCount });
  } catch (err) {
    console.error('❌ getUnreadMessageCount error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

exports.getEmployerInterviewAlerts = async (req, res) => {
  const employer_id = req.user.employer_id || req.user.id;

  if (req.user.role !== 'employer') {
    return res.status(403).json({ error: 'Unauthorized: Employer role required' });
  }

  try {
    const [result] = await req.db.query(
      `SELECT 
         i.id AS interview_id, i.job_id, i.jobseeker_id, i.interview_date, i.interview_type, i.status,
         i.zoom_link, i.dress_code, i.document_url,
         jp.Job_title AS jobTitle, jp.Company_name AS companyName,
         s.full_name AS jobseekerName
       FROM interviews i
       JOIN job_postings jp ON i.job_id = jp.id
       JOIN seekers s ON i.jobseeker_id = s.id
       WHERE i.employer_id = ? AND i.status IN ('Scheduled', 'Confirmed')
       ORDER BY i.interview_date ASC`,
      [employer_id]
    );

    result.forEach((alert) => {
      if (alert.document_url && !isDriveUrl(alert.document_url)) {
        alert.document_url = `${Base_Url}${alert.document_url}`;
      }
    });

    res.json(result);
  } catch (err) {
    console.error('❌ getEmployerInterviewAlerts error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

exports.getEmployerApplicationAlerts = async (req, res) => {
  const employer_id = req.user.employer_id || req.user.id;

  if (req.user.role !== 'employer') {
    return res.status(403).json({ error: 'Unauthorized: Employer role required' });
  }

  try {
    const [result] = await req.db.query(
      `SELECT 
         ja.id AS application_id, ja.job_id, ja.jobseeker_id, ja.created_at AS appliedDate,
         ja.status, ja.full_name AS applicantName,
         jp.Job_title AS jobTitle, jp.Company_name AS companyName
       FROM job_applications ja
       JOIN job_postings jp ON ja.job_id = jp.id
       WHERE jp.employer_id = ? AND ja.status = 'Pending'
       ORDER BY ja.created_at DESC
       LIMIT 10`,
      [employer_id]
    );
    res.json(result);
  } catch (err) {
    console.error('❌ getEmployerApplicationAlerts error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

exports.getEmployerInterviewCount = async (req, res) => {
  const employer_id = req.user.employer_id || req.user.id;

  if (req.user.role !== 'employer') {
    return res.status(403).json({ error: 'Unauthorized: Employer role required' });
  }

  try {
    const [result] = await req.db.query(
      `SELECT COUNT(*) AS interviewCount
       FROM interviews i
       JOIN job_postings jp ON i.job_id = jp.id
       WHERE jp.employer_id = ? AND i.status IN ('Scheduled', 'Confirmed')`,
      [employer_id]
    );
    res.json({ count: result[0].interviewCount });
  } catch (err) {
    console.error('❌ getEmployerInterviewCount error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

exports.getEmployerApplicationCount = async (req, res) => {
  const employer_id = req.user.employer_id || req.user.id;

  if (req.user.role !== 'employer') {
    return res.status(403).json({ error: 'Unauthorized: Employer role required' });
  }

  try {
    const [result] = await req.db.query(
      `SELECT COUNT(*) AS applicationCount
       FROM job_applications ja
       JOIN job_postings jp ON ja.job_id = jp.id
       WHERE jp.employer_id = ? AND ja.status = 'Pending'`,
      [employer_id]
    );
    res.json({ count: result[0].applicationCount });
  } catch (err) {
    console.error('❌ getEmployerApplicationCount error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};