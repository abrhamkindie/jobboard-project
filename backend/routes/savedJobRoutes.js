const express = require('express');
const router = express.Router();
const savedJobController = require('../controllers/savedJobController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/save_job', authenticate, savedJobController.saveJob);
router.post('/unsave_job', authenticate, savedJobController.unsaveJob);
router.get('/saved_jobs', authenticate, savedJobController.getSavedJobs);

module.exports = router;