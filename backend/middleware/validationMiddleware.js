 module.exports.validateFormData = (req, res, next) => {
  const { full_name, email, phone, password, confirm_password, role } = req.body;

  // Check for missing required fields
  if (!full_name || !email || !phone || !password || !confirm_password || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Validate password strength
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error:
        'Password must be at least 6 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.',
    });
  }

  // Check if passwords match
  if (password !== confirm_password) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  // Validate role
  if (!['seeker', 'employer'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role provided' });
  }

  // If all validations pass, proceed to the next middleware
  next();
};