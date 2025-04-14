// const {insertIntoDatabase}=require('../utils/helpers')
// const  Base_Url  = require('../config/Base_Url');
// const fs = require('fs'); // Add this to interact with the file system
// const path = require('path'); // Add this to handle file paths



 
// // Get a single job seeker's profile
// exports.getJobSeekerInfo = (req, res) => {
//   const user_id = req.query.user_id;  

//   if (!user_id) {
//     return res.status(400).json({ error: 'User ID is required' });
//   }

//   req.db.query('SELECT * FROM seekers WHERE id = ?', [user_id], (err, results) => {
//     if (err) {
//       console.error('Error fetching JobSeeker info:', err);
//       return res.status(500).json({ error: 'Database error', details: err.message });
//     }
    
//     if (results.length === 0) {
//       return res.status(404).json({ error: 'Job seeker not found' });
//     }
    
//     res.status(200).json(results[0]);
//   });
// };


 

// exports.updateUserProfile = (req, res) => {
 

//   const profilePath = req.files && req.files.profile ? `/uploads/${req.files.profile[0].filename}` : null;
//   const resumePath = req.files && req.files.resume ? `/uploads/${req.files.resume[0].filename}` : null;
 

//   const {
//     full_name,
//     email,
//     phone,
//     job_title,
//     skills,
//     experience_level,
//     location_preference,
//     education,
//     work_experience,
//     bio,
//     certifications,
//     linkedin,
//     github,
//     availability,
//     job_seeker_id,
//   } = req.body;

 
//   if (!job_seeker_id) {
//     console.log('Missing job_seeker_id');
//     return res.status(400).json({ error: 'job_seeker_id is required' });
//   }

//   // Fetch current profile and resume paths
//   const selectQuery = 'SELECT profile, resume FROM  seekers WHERE  id = ?';
//   req.db.query(selectQuery, [job_seeker_id], (selectErr, selectResult) => {
//     if (selectErr) {
//       console.error('Error fetching current profile:', selectErr);
//       return res.status(500).json({ error: 'Error fetching current profile', details: selectErr.message });
//     }

//     const currentProfile = selectResult[0]?.profile;
//     const currentResume = selectResult[0]?.resume;
 

//     const update = `
//       UPDATE  seekers 
//       SET 
//         full_name = ?, 
//         email = ?, 
//         phone = ?, 
//         job_title = ?, 
//         skills = ?, 
//         experience_level = ?, 
//         location_preference = ?, 
//         resume = ?, 
//         profile = ?,
//         education = ?,
//         work_experience = ?,
//         bio = ?,
//         certifications = ?,
//         linkedin = ?,
//         github = ?,
//         availability = ?
//       WHERE  id = ?`;

//     const values = [
//       full_name || null,
//       email || null,
//       phone || null,
//       job_title || null,
//       skills || null,
//       experience_level || null,
//       location_preference || null,
//       resumePath || currentResume,
//       profilePath || currentProfile,
//       education || null,
//       work_experience || null,
//       bio || null,
//       certifications || null,
//       linkedin || null,
//       github || null,
//       availability || null,
//       job_seeker_id,
//     ];

 
//     req.db.query(update, values, (err, response) => {
//       if (err) {
//         console.error('Error updating job seeker profile:', err);
//         return res.status(500).json({ 
//           error: 'Error updating job seeker profile', 
//           details: err.message 
//         });
//       }
//       console.log('Query Response:', response);
//       if (response.affectedRows === 0) {
//         console.log('No rows updated - job_seeker_id not found');
//         return res.status(404).json({ error: 'Job seeker not found' });
//       }

//       // Delete old files if new ones were uploaded
//       if (profilePath && currentProfile && currentProfile !== profilePath) {
//         const oldProfilePath = path.join(__dirname, '..', currentProfile);
//         fs.unlink(oldProfilePath, (unlinkErr) => {
//           if (unlinkErr) console.error('Error deleting old profile picture:', unlinkErr);
//           else console.log(`Deleted old profile picture: ${oldProfilePath}`);
//         });
//       }
//       if (resumePath && currentResume && currentResume !== resumePath) {
//         const oldResumePath = path.join(__dirname, '..', currentResume);
//         fs.unlink(oldResumePath, (unlinkErr) => {
//           if (unlinkErr) console.error('Error deleting old resume:', unlinkErr);
//           else console.log(`Deleted old resume: ${oldResumePath}`);
//         });
//       }

//       res.json({ 
//         message: 'Profile updated successfully',
//         profile: profilePath || currentProfile,
//         resume: resumePath || currentResume,
//         affectedRows: response.affectedRows 
//       });
//     });
//   });
// };



// // Get a single employer`s profile
// exports.getEmployerInfo = (req, res) => {
//   const user_id = req.query.user_id;  

//   if (!user_id) {
//     return res.status(400).json({ error: 'User ID is required' });
//   }

//   req.db.query('SELECT * FROM employers WHERE employer_id = ?', [user_id], (err, results) => {
//     if (err) {
//       console.error('Error fetching employer info:', err);
//       return res.status(500).json({ error: 'Database error', details: err.message });
//     }
    
//     if (results.length === 0) {
//       return res.status(404).json({ error: 'employer not found' });
//     }
    
//     res.status(200).json(results[0]);
//   });
// };

 
// exports.updateEmployerProfile = (req, res) => {
//   console.log('Request Body:', req.body);
//   console.log('Request Files:', req.files);

//   const logoPath = req.files && req.files.logo ? `/uploads/${req.files.logo[0].filename}` : null;
//   console.log('Logo Path:', logoPath);

//   const {
//     full_name,
//     email,
//     phone,
//     company_name,
//     industry,
//     company_size,
//     job_description,
//     company_website,
//     company_description,
//     founded_year,
//     location,
//     linkedin,
//     twitter,
//     employee_benefits,
//     employer_id,
//   } = req.body;

//   console.log('Extracted employer_id:', employer_id);

//   if (!employer_id) {
//     console.log('Missing employer_id');
//     return res.status(400).json({ error: 'employer_id is required' });
//   }

//   // Fetch current logo path
//   const selectQuery = 'SELECT logo FROM employers WHERE employer_id = ?';
//   req.db.query(selectQuery, [employer_id], (selectErr, selectResult) => {
//     if (selectErr) {
//       console.error('Error fetching current profile:', selectErr);
//       return res.status(500).json({ error: 'Error fetching current profile', details: selectErr.message });
//     }

//     const currentLogo = selectResult[0]?.logo;
//     console.log('Current Logo:', currentLogo);

//     const update = `
//       UPDATE employers 
//       SET 
//         full_name = ?, 
//         email = ?, 
//         phone = ?, 
//         company_name = ?, 
//         industry = ?, 
//         company_size = ?, 
//         job_description = ?, 
//         logo = ?,
//         company_website = ?,
//         company_description = ?,
//         founded_year = ?,
//         location = ?,
//         linkedin = ?,
//         twitter = ?,
//         employee_benefits = ?
//       WHERE employer_id = ?`;

//     const values = [
//       full_name || null,
//       email || null,
//       phone || null,
//       company_name || null,
//       industry || null,
//       company_size || null,
//       job_description || null,
//       logoPath || currentLogo,
//       company_website || null,
//       company_description || null,
//       founded_year || null,
//       location || null,
//       linkedin || null,
//       twitter || null,
//       employee_benefits || null,
//       employer_id,
//     ];

//     console.log('Query Values:', values);

//     req.db.query(update, values, (err, response) => {
//       if (err) {
//         console.error('Error updating employer profile:', err);
//         return res.status(500).json({ 
//           error: 'Error updating employer profile', 
//           details: err.message 
//         });
//       }
//       console.log('Query Response:', response);
//       if (response.affectedRows === 0) {
//         console.log('No rows updated - employer_id not found');
//         return res.status(404).json({ error: 'Employer not found' });
//       }

//       // Delete old logo if a new one was uploaded
//       if (logoPath && currentLogo && currentLogo !== logoPath) {
//         const oldLogoPath = path.join(__dirname, '..', currentLogo);
//         fs.unlink(oldLogoPath, (unlinkErr) => {
//           if (unlinkErr) console.error('Error deleting old logo:', unlinkErr);
//           else console.log(`Deleted old logo: ${oldLogoPath}`);
//         });
//       }

//       res.json({ 
//         message: 'Profile updated successfully',
//         logo: logoPath || currentLogo,
//         affectedRows: response.affectedRows 
//       });
//     });
//   });
// };



const { insertIntoDatabase } = require('../utils/helpers');
const Base_Url = require('../config/Base_Url');

// Get a single job seeker's profile
exports.getJobSeekerInfo = (req, res) => {
  const user_id = req.query.user_id;
  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  req.db.query('SELECT * FROM seekers WHERE id = ?', [user_id], (err, results) => {
    if (err) {
      console.error('Error fetching JobSeeker info:', err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Job seeker not found' });
    }
    const seeker = results[0];
    if (seeker.profile) seeker.profile = seeker.profile;
    if (seeker.resume) seeker.resume = seeker.resume;
    res.status(200).json(seeker);
  });
};

// Update job seeker profile
exports.updateUserProfile = (req, res) => {
  const { full_name, email, phone, job_title, skills, experience_level, location_preference, education, work_experience, bio, certifications, linkedin, github, availability, job_seeker_id } = req.body;
  if (!job_seeker_id) {
    return res.status(400).json({ error: 'job_seeker_id is required' });
  }

  const profileUrl = req.file && req.file.fieldname === 'profile' ? req.file.path : null;
  const resumeUrl = req.file && req.file.fieldname === 'resume' ? req.file.path : null;

  const selectQuery = 'SELECT profile, resume FROM seekers WHERE id = ?';
  req.db.query(selectQuery, [job_seeker_id], (selectErr, selectResult) => {
    if (selectErr) {
      console.error('Error fetching current profile:', selectErr);
      return res.status(500).json({ error: 'Error fetching current profile', details: selectErr.message });
    }

    const currentProfile = selectResult[0]?.profile;
    const currentResume = selectResult[0]?.resume;

    const update = `
      UPDATE seekers 
      SET 
        full_name = ?, email = ?, phone = ?, job_title = ?, skills = ?, experience_level = ?, 
        location_preference = ?, resume = COALESCE(?, resume), profile = COALESCE(?, profile),
        education = ?, work_experience = ?, bio = ?, certifications = ?, linkedin = ?, github = ?, availability = ?
      WHERE id = ?`;
    const values = [      full_name || null, email || null, phone || null, job_title || null, skills || null, experience_level || null,      location_preference || null, resumeUrl, profileUrl, education || null, work_experience || null, bio || null,      certifications || null, linkedin || null, github || null, availability || null, job_seeker_id,    ];

    req.db.query(update, values, (err, response) => {
      if (err) {
        console.error('Error updating job seeker profile:', err);
        return res.status(500).json({ error: 'Error updating job seeker profile', details: err.message });
      }
      if (response.affectedRows === 0) {
        return res.status(404).json({ error: 'Job seeker not found' });
      }
      res.json({ message: 'Profile updated successfully', profile: profileUrl || currentProfile, resume: resumeUrl || currentResume });
    });
  });
};

// Get a single employer's profile
exports.getEmployerInfo = (req, res) => {
  const user_id = req.query.user_id;
  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  req.db.query('SELECT * FROM employers WHERE employer_id = ?', [user_id], (err, results) => {
    if (err) {
      console.error('Error fetching employer info:', err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Employer not found' });
    }
    const employer = results[0];
    if (employer.logo) employer.logo = employer.logo;
    res.status(200).json(employer);
  });
};

// Update employer profile
exports.updateEmployerProfile = (req, res) => {
  const { full_name, email, phone, company_name, industry, company_size, job_description, company_website, company_description, founded_year, location, linkedin, twitter, employee_benefits, employer_id } = req.body;
  if (!employer_id) {
    return res.status(400).json({ error: 'employer_id is required' });
  }

  const logoUrl = req.file && req.file.fieldname === 'logo' ? req.file.path : null;

  const selectQuery = 'SELECT logo FROM employers WHERE employer_id = ?';
  req.db.query(selectQuery, [employer_id], (selectErr, selectResult) => {
    if (selectErr) {
      console.error('Error fetching current profile:', selectErr);
      return res.status(500).json({ error: 'Error fetching current profile', details: selectErr.message });
    }

    const currentLogo = selectResult[0]?.logo;

    const update = `
      UPDATE employers 
      SET 
        full_name = ?, email = ?, phone = ?, company_name = ?, industry = ?, company_size = ?, 
        job_description = ?, logo = COALESCE(?, logo), company_website = ?, company_description = ?, 
        founded_year = ?, location = ?, linkedin = ?, twitter = ?, employee_benefits = ?
      WHERE employer_id = ?`;
    const values = [      full_name || null, email || null, phone || null, company_name || null, industry || null, company_size || null,      job_description || null, logoUrl, company_website || null, company_description || null, founded_year || null,      location || null, linkedin || null, twitter || null, employee_benefits || null, employer_id,    ];

    req.db.query(update, values, (err, response) => {
      if (err) {
        console.error('Error updating employer profile:', err);
        return res.status(500).json({ error: 'Error updating employer profile', details: err.message });
      }
      if (response.affectedRows === 0) {
        return res.status(404).json({ error: 'Employer not found' });
      }
      res.json({ message: 'Profile updated successfully', logo: logoUrl || currentLogo });
    });
  });
};