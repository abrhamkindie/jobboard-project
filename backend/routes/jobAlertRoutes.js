const express = require('express');
const router = express.Router();
const jobAlertController = require('../controllers/jobAlertController');

router.post('/job_alerts', jobAlertController.subscribeToJobAlerts);
router.post('/unsubscribe_job_alerts', jobAlertController.unsubscribeFromJobAlerts);
router.get('/job_alerts', jobAlertController.getSubscriptionStatus);

module.exports = router;