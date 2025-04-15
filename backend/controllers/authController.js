// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
// const { handleJobSeeker, handleEmployer } = require('./jobController');




// exports.signup = (req, res) => {
//   const db = req.db;

//   const { email, role } = req.body;

//   // Validate required fields
//   if (!email || !role) {
//     return res.status(400).json({ error: 'Email and role are required' });
//   }

//   // Check if email already exists
//   db.query(
//     'SELECT email FROM seekers WHERE email = ? UNION SELECT email FROM employers WHERE email = ?',
//     [email, email],
//     (err, results) => {
//       if (err) {
//         console.error('❌ Database error:', err);
//         return res.status(500).json({ error: 'Server error' });
//       }

//       if (results.length > 0) {
//         return res.status(400).json({ error: 'Email already registered.' });
//       }

//       // Hash the password
//       bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
//         if (err) {
//           console.error('❌ Error hashing password:', err);
//           return res.status(500).json({ error: 'Server error' });
//         }

//         // Replace the plain text password with the hashed password
//         req.body.password = hashedPassword;

//         // Handle role-based signup
//         if (role === 'seeker') {
//           handleJobSeeker(req, res);
//         } else if (role === 'employer') {
//           handleEmployer(req, res);
//         } else {
//           res.status(400).json({ error: 'Invalid role provided' });
//         }
//       });
//     }
//   );
// };

 

// exports.login = async (req, res) => {
//   const db = req.db;
//   const { email, password } = req.body;

//   // Validate required fields
//   if (!email || !password) {
//     return res.status(400).json({ error: 'Email and password are required' });
//   }

//   try {
//     // Check seekers table
//     const [seekersResult] = await db.promise().query('SELECT * FROM seekers WHERE email = ?', [email]);
//     if (seekersResult.length > 0) {
//       const seeker = seekersResult[0];
//       const isPasswordValid = await bcrypt.compare(password, seeker.password);
//       if (!isPasswordValid) {
//         return res.status(401).json({ error: 'Invalid email or password' });
//       }

//       const token = jwt.sign({ id: seeker.id,jobSeeker_id: seeker.id, role: 'seeker' }, process.env.JWT_SECRET, { expiresIn: '253402300799' });
//       return res.json({
//         message: 'Login successful',
//         role: 'seeker',
//         token,
//         userEmail: seeker.email,
//         userId: seeker.id,
//         name: seeker.full_name,
//         profile_picture_url: seeker.profile,
//       });
//     }

//     // Check employers table
//     const [employersResult] = await db.promise().query('SELECT * FROM employers WHERE email = ?', [email]);
//     if (employersResult.length > 0) {
//       const employer = employersResult[0];
//       const isPasswordValid = await bcrypt.compare(password, employer.password);
//       if (!isPasswordValid) {
//         return res.status(401).json({ error: 'Invalid email or password' });
//       }

//       // Generate JWT token with employer_id
//       const token = jwt.sign(
//         { id: employer.id, employer_id: employer.employer_id, role: 'employer' },
//         process.env.JWT_SECRET,
//         { expiresIn: '253402300799' }
//       );
//       return res.json({
//         message: 'Login successful',
//         role: 'employer',
//         token,
//         name: employer.company_name,
//         companyLogo: employer.logo,
//         userFullName: employer.full_name,
//         employerId: employer.employer_id,
//       });
//     }

//     return res.status(401).json({ error: 'Invalid email or password' });
//   } catch (err) {
//     console.error('❌ Error during login:', err);
//     return res.status(500).json({ error: 'Server error' });
//   }
// };


  
const bcrypt = require('bcrypt');
const { handleJobSeeker, handleEmployer } = require('./jobController');

exports.signup = async (req, res) => {
  const { full_name, email, phone, password, role, terms } = req.body;

  if (!full_name || !email || !phone || !password || !role || !terms) {
    return res.status(400).json({ error: 'Required fields missing' });
  }

  if (terms !== 'true') {
    return res.status(400).json({ error: 'Terms must be accepted' });
  }

  try {
    const [results] = await req.db.query(
      'SELECT email FROM seekers WHERE email = ? UNION SELECT email FROM employers WHERE email = ?',
      [email, email]
    );
    if (results.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    req.body.password = hashedPassword;

    if (role === 'seeker') {
      return handleJobSeeker(req, res);
    } else if (role === 'employer') {
      return handleEmployer(req, res);
    }
    return res.status(400).json({ error: 'Invalid role provided' });
  } catch (err) {
    console.error('❌ Signup error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const [seekersResult] = await req.db.query('SELECT * FROM seekers WHERE email = ?', [email]);
    if (seekersResult.length > 0) {
      const seeker = seekersResult[0];
      const isPasswordValid = await bcrypt.compare(password, seeker.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = jwt.sign({ id: seeker.id, jobSeeker_id: seeker.id, role: 'seeker' }, process.env.JWT_SECRET, { expiresIn: '7d' });
      return res.json({
        message: 'Login successful',
        role: 'seeker',
        token,
        userEmail: seeker.email,
        userId: seeker.id,
        name: seeker.full_name,
        profile_picture_url: seeker.profile,
      });
    }

    const [employersResult] = await req.db.query('SELECT * FROM employers WHERE email = ?', [email]);
    if (employersResult.length > 0) {
      const employer = employersResult[0];
      const isPasswordValid = await bcrypt.compare(password, employer.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = jwt.sign({ id: employer.id, employer_id: employer.employer_id, role: 'employer' }, process.env.JWT_SECRET, { expiresIn: '7d' });
      return res.json({
        message: 'Login successful',
        role: 'employer',
        token,
        name: employer.company_name,
        companyLogo: employer.logo,
        userFullName: employer.full_name,
        employerId: employer.employer_id,
      });
    }

    return res.status(401).json({ error: 'Invalid email or password' });
  } catch (err) {
    console.error('❌ Error during login:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};