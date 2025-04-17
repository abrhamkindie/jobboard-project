 const { google } = require("googleapis");
const Base_Url = require("../config/Base_Url");

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/drive"],
});
const drive = google.drive({ version: "v3", auth });

const isDriveUrl = (url) => url && url.startsWith("https://drive.google.com/");
const getDriveFileId = (url) => {
  if (!isDriveUrl(url)) return null;
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
};
const deleteDriveFile = async (fileId) => {
  if (!fileId) return;
  try {
    await drive.files.delete({ fileId });
    console.log(`Deleted Drive file: ${fileId}`);
  } catch (err) {
    console.error(`Error deleting Drive file ${fileId}:`, err.message);
  }
};

exports.getJobSeekerInfo = async (req, res) => {
  const user_id = req.query.user_id || req.user.jobSeeker_id || req.user.id;
  console.log("getJobSeekerInfo - Fetching for user_id:", user_id);

  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const [results] = await req.db.query(
      "SELECT id, full_name, email, phone, job_title, skills, experience_level, location_preference, resume, profile, education, work_experience, bio, certifications, linkedin, github, availability FROM seekers WHERE id = ?",
      [user_id]
    );
    if (results.length === 0) {
      console.warn("getJobSeekerInfo - No seeker found for id:", user_id);
      return res.status(404).json({ error: "Job seeker not found" });
    }

    const seeker = results[0];
    console.log("getJobSeekerInfo - Raw data:", seeker);

    // Use Drive URLs as-is
    if (seeker.profile && !isDriveUrl(seeker.profile)) {
      seeker.profile = `${Base_Url}${seeker.profile}`;
    }
    if (seeker.resume && !isDriveUrl(seeker.resume)) {
      seeker.resume = `${Base_Url}${seeker.resume}`;
    }

    res.status(200).json(seeker);
  } catch (err) {
    console.error("getJobSeekerInfo - Error:", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
};

exports.updateUserProfile = async (req, res) => {
  const {
    full_name,
    email,
    phone,
    job_title,
    skills,
    experience_level,
    location_preference,
    education,
    work_experience,
    bio,
    certifications,
    linkedin,
    github,
    availability,
    job_seeker_id,
  } = req.body;
  const profile = req.files?.profile?.[0]?.url || null;
  const resume = req.files?.resume?.[0]?.url || null;

  const user_id = job_seeker_id || req.user.jobSeeker_id || req.user.id;
  console.log("updateUserProfile - Updating for user_id:", user_id, { profile, resume });

  if (!user_id) {
    return res.status(400).json({ error: "job_seeker_id is required" });
  }

  try {
    const [current] = await req.db.query("SELECT profile, resume FROM seekers WHERE id = ?", [user_id]);
    if (current.length === 0) {
      console.warn("updateUserProfile - No seeker found for id:", user_id);
      return res.status(404).json({ error: "Job seeker not found" });
    }

    const currentProfile = current[0].profile;
    const currentResume = current[0].resume;

    const updateData = {
      full_name: full_name || null,
      email: email || null,
      phone: phone || null,
      job_title: job_title || null,
      skills: skills || null,
      experience_level: experience_level || null,
      location_preference: location_preference || null,
      resume: resume || currentResume,
      profile: profile || currentProfile,
      education: education || null,
      work_experience: work_experience || null,
      bio: bio || null,
      certifications: certifications || null,
      linkedin: linkedin || null,
      github: github || null,
      availability: availability || null,
    };

    console.log("updateUserProfile - Update data:", updateData);

    const [result] = await req.db.query(
      `
      UPDATE seekers 
      SET full_name = ?, email = ?, phone = ?, job_title = ?, skills = ?, 
          experience_level = ?, location_preference = ?, resume = ?, profile = ?,
          education = ?, work_experience = ?, bio = ?, certifications = ?,
          linkedin = ?, github = ?, availability = ?
      WHERE id = ?
      `,
      [
        updateData.full_name,
        updateData.email,
        updateData.phone,
        updateData.job_title,
        updateData.skills,
        updateData.experience_level,
        updateData.location_preference,
        updateData.resume,
        updateData.profile,
        updateData.education,
        updateData.work_experience,
        updateData.bio,
        updateData.certifications,
        updateData.linkedin,
        updateData.github,
        updateData.availability,
        user_id,
      ]
    );

    if (result.affectedRows === 0) {
      console.warn("updateUserProfile - No rows updated for id:", user_id);
      return res.status(404).json({ error: "Job seeker not found" });
    }

    if (profile && currentProfile && currentProfile !== profile) {
      const oldProfileId = getDriveFileId(currentProfile);
      await deleteDriveFile(oldProfileId);
    }
    if (resume && currentResume && currentResume !== resume) {
      const oldResumeId = getDriveFileId(currentResume);
      await deleteDriveFile(oldResumeId);
    }

    const [updatedSeeker] = await req.db.query(
      "SELECT id, full_name, email, phone, job_title, skills, experience_level, location_preference, resume, profile, education, work_experience, bio, certifications, linkedin, github, availability FROM seekers WHERE id = ?",
      [user_id]
    );
    const seeker = updatedSeeker[0] || {};
    if (seeker.profile && !isDriveUrl(seeker.profile)) {
      seeker.profile = `${Base_Url}${seeker.profile}`;
    }
    if (seeker.resume && !isDriveUrl(seeker.resume)) {
      seeker.resume = `${Base_Url}${seeker.resume}`;
    }

    console.log("updateUserProfile - Updated seeker:", seeker);

    res.json({
      message: "Profile updated successfully",
      profile: seeker.profile, // Change from seeker to seeker.profile
      resume: seeker.resume,
    });
  } catch (err) {
    console.error("updateUserProfile - Error:", err);
    res.status(500).json({ error: "Error updating profile", details: err.message });
  }
};

// Employer methods unchanged
exports.getEmployerInfo = async (req, res) => {
  const user_id = req.query.user_id || req.user.employer_id || req.user.id;
 
  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const [results] = await req.db.query("SELECT * FROM employers WHERE employer_id = ?", [user_id]);
    if (results.length === 0) {
      console.warn("getEmployerInfo - No employer found for id:", user_id);
      return res.status(404).json({ error: "Employer not found" });
    }

    const employer = results[0];
    if (employer.logo && !isDriveUrl(employer.logo)) {
      employer.logo = `${Base_Url}${employer.logo}`;
    }

    res.status(200).json(employer);
  } catch (err) {
    console.error("getEmployerInfo - Error:", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
};

exports.updateEmployerProfile = async (req, res) => {
  const {
    full_name,
    email,
    phone,
    company_name,
    industry,
    company_size,
    job_description,
    company_website,
    company_description,
    founded_year,
    location,
    linkedin,
    twitter,
    employee_benefits,
    employer_id,
  } = req.body;
  const logo = req.files?.logo?.[0]?.url || null;

  const user_id = employer_id || req.user.employer_id || req.user.id;
  console.log("updateEmployerProfile - Updating for user_id:", user_id, { logo });

  if (!user_id) {
    return res.status(400).json({ error: "employer_id is required" });
  }

  try {
    const [current] = await req.db.query("SELECT logo FROM employers WHERE employer_id = ?", [user_id]);
    if (current.length === 0) {
      console.warn("updateEmployerProfile - No employer found for id:", user_id);
      return res.status(404).json({ error: "Employer not found" });
    }

    const currentLogo = current[0].logo;
    const updateData = {
      full_name: full_name || null,
      email: email || null,
      phone: phone || null,
      company_name: company_name || null,
      industry: industry || null,
      company_size: company_size || null,
      job_description: job_description || null,
      logo: logo || currentLogo,
      company_website: company_website || null,
      company_description: company_description || null,
      founded_year: founded_year || null,
      location: location || null,
      linkedin: linkedin || null,
      twitter: twitter || null,
      employee_benefits: employee_benefits || null,
    };

    const [result] = await req.db.query(
      `
      UPDATE employers 
      SET full_name = ?, email = ?, phone = ?, company_name = ?, industry = ?, 
          company_size = ?, job_description = ?, logo = ?, company_website = ?,
          company_description = ?, founded_year = ?, location = ?, linkedin = ?,
          twitter = ?, employee_benefits = ?
      WHERE employer_id = ?
      `,
      [
        updateData.full_name,
        updateData.email,
        updateData.phone,
        updateData.company_name,
        updateData.industry,
        updateData.company_size,
        updateData.job_description,
        updateData.logo,
        updateData.company_website,
        updateData.company_description,
        updateData.founded_year,
        updateData.location,
        updateData.linkedin,
        updateData.twitter,
        updateData.employee_benefits,
        user_id,
      ]
    );

    if (result.affectedRows === 0) {
      console.warn("updateEmployerProfile - No rows updated for id:", user_id);
      return res.status(404).json({ error: "Employer not found" });
    }

    if (logo && currentLogo && currentLogo !== logo) {
      const oldLogoId = getDriveFileId(currentLogo);
      await deleteDriveFile(oldLogoId);
    }

    const [updatedEmployer] = await req.db.query("SELECT * FROM employers WHERE employer_id = ?", [user_id]);
    const employer = updatedEmployer[0];
    if (employer.logo && !isDriveUrl(employer.logo)) {
      employer.logo = `${Base_Url}${employer.logo}`;
    }

    console.log("updateEmployerProfile - Updated employer:", employer);

    res.json({
      message: "Profile updated successfully",
      profile: employer,
    });
  } catch (err) {
    console.error("updateEmployerProfile - Error:", err);
    res.status(500).json({ error: "Error updating profile", details: err.message });
  }
};



 
exports.getSeekerSummary = async (req, res) => {
  const userId = req.user.id; // From authMiddleware (JWT)

  try {
    // Total Applications
    const [totalApps] = await pool.query(
      'SELECT COUNT(*) AS count FROM job_applications WHERE applicant_id = ?',
      [userId]
    );

    // Interviews Scheduled (status = 'Interview')
    const [interviews] = await pool.query(
      'SELECT COUNT(*) AS count FROM job_applications WHERE applicant_id = ? AND status = ?',
      [userId, 'Interview']
    );

    // Offers Received (status = 'Offered')
    const [offers] = await pool.query(
      'SELECT COUNT(*) AS count FROM job_applications WHERE applicant_id = ? AND status = ?',
      [userId, 'Offered']
    );

    // Response Rate (non-Submitted applications / total)
    const [responded] = await pool.query(
      'SELECT COUNT(*) AS count FROM job_applications WHERE applicant_id = ? AND status != ?',
      [userId, 'Submitted']
    );
    const responseRate = totalApps[0].count > 0
      ? Math.round((responded[0].count / totalApps[0].count) * 100)
      : 0;

    // Card-specific data
    // Application Progress
    const [underReview] = await pool.query(
      'SELECT COUNT(*) AS count FROM job_applications WHERE applicant_id = ? AND status = ?',
      [userId, 'Under Review']
    );
    const [awaiting] = await pool.query(
      'SELECT COUNT(*) AS count FROM job_applications WHERE applicant_id = ? AND status = ?',
      [userId, 'Submitted']
    );

    // Interview Pipeline
    const [upcoming] = await pool.query(
      'SELECT COUNT(*) AS count FROM job_applications WHERE applicant_id = ? AND status = ? AND interview_date > NOW()',
      [userId, 'Interview']
    );
    const [completed] = await pool.query(
      'SELECT COUNT(*) AS count FROM job_applications WHERE applicant_id = ? AND status = ? AND interview_date < NOW()',
      [userId, 'Interview']
    );

    // Job Offers
    const [pending] = await pool.query(
      'SELECT COUNT(*) AS count FROM job_applications WHERE applicant_id = ? AND status = ?',
      [userId, 'Offered']
    );
    const [accepted] = await pool.query(
      'SELECT COUNT(*) AS count FROM job_applications WHERE applicant_id = ? AND status = ?',
      [userId, 'Accepted']
    );

    // Engagement (assumed tables)
    const [profileViews] = await pool.query(
      'SELECT profile_views FROM user_profiles WHERE user_id = ?',
      [userId]
    );
    const [messages] = await pool.query(
      'SELECT COUNT(*) AS count FROM messages WHERE recipient_id = ? AND sender_role = ?',
      [userId, 'employer']
    );
    const [savedJobs] = await pool.query(
      'SELECT COUNT(*) AS count FROM saved_jobs WHERE user_id = ?',
      [userId]
    );

    res.status(200).json({
      totalApplications: totalApps[0].count,
      interviewsScheduled: interviews[0].count,
      offersReceived: offers[0].count,
      responseRate,
      applicationProgress: {
        submitted: awaiting[0].count,
        underReview: underReview[0].count,
        awaitingResponse: awaiting[0].count,
      },
      interviewPipeline: {
        scheduled: interviews[0].count,
        upcoming: upcoming[0].count,
        completed: completed[0].count,
      },
      jobOffers: {
        received: offers[0].count,
        pendingDecision: pending[0].count,
        accepted: accepted[0].count,
      },
      engagement: {
        profileViews: profileViews[0]?.profile_views || 0,
        employerMessages: messages[0].count,
        savedJobs: savedJobs[0].count,
      },
    });
  } catch (error) {
    console.error('Error fetching seeker summary:', error);
    res.status(500).json({ error: 'Failed to fetch summary data' });
  }
};

