//  const { validateEmail } = require('../utils/emailValidator');

// // Subscribe to job alerts
// exports.subscribeToJobAlerts = (req, res) => {
//   const db = req.db;

//   const { email, preferences ,frequency} = req.body;

//   if (!email || !preferences) {
//     return res.status(400).json({ error: 'Email and preferences are required' });
//   }

//   if (!validateEmail(email)) {
//     return res.status(400).json({ error: 'Invalid email format' });
//   }

//   const checkQuery = 'SELECT * FROM job_alerts WHERE email = ?';
//   db.query(checkQuery, [email], (err, result) => {
//     if (err) {
//       console.error('Error checking subscription:', err);
//       return res.status(500).json({ error: 'Error checking subscription' });
//     }

//     if (result.length > 0) {
//       return res.status(400).json({ error: 'Email already subscribed' });
//     }

//     const insertQuery = 'INSERT INTO job_alerts (email, preferences,frequency) VALUES (?, ?, ?)';
//     db.query(insertQuery, [email, JSON.stringify(preferences),frequency], (err, result) => {
//       if (err) {
//         console.error('Error saving job alert:', err);
//         return res.status(500).json({ error: 'Error saving job alert' });
//       }
//       return res.json({ message: 'Job alert subscription successful' });
//     });
//   });
// };

// // Unsubscribe from job alerts
// exports.unsubscribeFromJobAlerts = (req, res) => {
//   const db = req.db;

//   const { email } = req.body;

//   if (!email) {
//     return res.status(400).json({ error: 'Email is required' });
//   }

//   const deleteQuery = 'DELETE FROM job_alerts WHERE email = ?';
//   db.query(deleteQuery, [email], (err, result) => {
//     if (err) {
//       console.error('Error unsubscribing:', err);
//       return res.status(500).json({ error: 'Error unsubscribing' });
//     }

//     if (result.affectedRows === 0) {
//       return res.json({ message: 'Email not found, but no action needed' });
//     }

//     return res.json({ message: 'Unsubscribed successfully' });
//   });
// };

// // Fetch subscription status
// exports.getSubscriptionStatus = (req, res) => {
//   const db = req.db;
//   const { email } = req.query;

//   if (!email) {
//     return res.status(400).json({ error: 'Email is required' });
//   }

//   const query = 'SELECT * FROM job_alerts WHERE email = ?';
//   db.query(query, [email], (err, result) => {
//     if (err) {
//       console.error('Error fetching subscription:', err);
//       return res.status(500).json({ error: 'Error fetching subscription' });
//     }

//     if (result.length === 0) {
//       return res.json({
//         isSubscribed: false,
//         preferences: [],
//         frequency: 'daily',
//       });
//     }

//     const subscription = result[0];
//     return res.json({
//       isSubscribed: true,
//       preferences: subscription.preferences ? JSON.parse(subscription.preferences) : [],
//       frequency: subscription.frequency || 'daily',
//     });
//   });
// };
const { validateEmail } = require('../utils/emailValidator');

exports.subscribeToJobAlerts = async (req, res) => {
  const { email, preferences, frequency } = req.body;

  if (!email || !preferences) {
    return res.status(400).json({ error: 'Email and preferences are required' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    const [result] = await req.db.query('SELECT * FROM job_alerts WHERE email = ?', [email]);
    if (result.length > 0) {
      return res.status(400).json({ error: 'Email already subscribed' });
    }

    await req.db.query('INSERT INTO job_alerts (email, preferences, frequency) VALUES (?, ?, ?)', [
      email,
      JSON.stringify(preferences),
      frequency,
    ]);
    res.json({ message: 'Job alert subscription successful' });
  } catch (err) {
    console.error('❌ Error subscribing:', err);
    res.status(500).json({ error: 'Error subscribing', details: err.message });
  }
};

exports.unsubscribeFromJobAlerts = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const [result] = await req.db.query('DELETE FROM job_alerts WHERE email = ?', [email]);
    if (result.affectedRows === 0) {
      return res.json({ message: 'Email not found, but no action needed' });
    }
    res.json({ message: 'Unsubscribed successfully' });
  } catch (err) {
    console.error('❌ Error unsubscribing:', err);
    res.status(500).json({ error: 'Error unsubscribing', details: err.message });
  }
};

exports.getSubscriptionStatus = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const [result] = await req.db.query('SELECT * FROM job_alerts WHERE email = ?', [email]);
    if (result.length === 0) {
      return res.json({
        isSubscribed: false,
        preferences: [],
        frequency: 'daily',
      });
    }

    const subscription = result[0];
    res.json({
      isSubscribed: true,
      preferences: subscription.preferences ? JSON.parse(subscription.preferences) : [],
      frequency: subscription.frequency || 'daily',
    });
  } catch (err) {
    console.error('❌ Error fetching subscription:', err);
    res.status(500).json({ error: 'Error fetching subscription', details: err.message });
  }
};