const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { uploadMiddleware } = require('../middleware/uploadMiddleware');
const { validateFormData } = require('../middleware/validationMiddleware');

router.post('/signup', uploadMiddleware, validateFormData, authController.signup);
router.post('/login', authController.login);

module.exports = router;