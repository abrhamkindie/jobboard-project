 

//const db = require('../managers/dbManager');

// Save a job for a user
exports.saveJob = (req, res) => {
  const db = req.db;

  const { job_id, user_id } = req.body;
 

  if (!job_id || !user_id) {
    console.error('Missing parameters:', { job_id, user_id });
    return res.status(400).json({ error: 'Job ID and User ID are required' });
  }

  const checkQuery = 'SELECT * FROM saved_jobs WHERE job_id = ? AND user_id = ?';
   db.query(checkQuery, [job_id, user_id], (err, results) => {
    if (err) {
      
      console.error('Error checking saved job:', err);
      return res.status(500).json({ error: 'Error checking saved job' });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: 'Job already saved' });
    }

    const insertQuery = 'INSERT INTO saved_jobs (job_id, user_id) VALUES (?, ?)';
 
    db.query(insertQuery, [job_id, user_id], (err) => {
      if (err) {
        console.error('Error saving job:', err);
        return res.status(500).json({ error: 'Error saving job' });
      }
      res.json({ message: 'Job saved successfully' });
    });
  });
};

// Unsave a job for a user
exports.unsaveJob = (req, res) => {
  const db = req.db;

  const { job_id, user_id } = req.body;

  if (!job_id || !user_id) {
    return res.status(400).json({ error: 'Job ID and User ID are required' });
  }

  const query = 'DELETE FROM saved_jobs WHERE job_id = ? AND user_id = ?';
  db.query(query, [job_id, user_id], (err, result) => {
    if (err) {
      console.error('Error unSaving job:', err);
      return res.status(500).json({ error: 'Error unSaving job' });
    }
    res.json({ message: 'Job unsaved successfully' });
  });
};

// Get saved jobs for a user
exports.getSavedJobs = (req, res) => {
  const db = req.db;
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const query = 'SELECT job_id FROM saved_jobs WHERE user_id = ?';
  db.query(query, [user_id], (err, results) => {
    if (err) {
      console.error('Error fetching saved jobs:', err);
      return res.status(500).json({ error: 'Error fetching saved jobs' });
    }
    res.json(results);
  });
};