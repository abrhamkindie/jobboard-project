const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { authenticate } = require('../middleware/authMiddleware');
 const { uploadMiddleware } = require('../middleware/uploadMiddleware');

 
router.get('/seeker_profile',authenticate,profileController.getJobSeekerInfo);
router.post('/update_seeker_profile',authenticate,uploadMiddleware,profileController.updateUserProfile); 
router.get('/employer_profile',authenticate,profileController.getEmployerInfo);
router.post('/update_employer_profile', authenticate,uploadMiddleware,profileController.updateEmployerProfile);
router.get('/summary',authenticate,profileController.getSeekerSummary);


module.exports = router;