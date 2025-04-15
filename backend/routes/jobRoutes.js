const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { authenticate } = require('../middleware/authMiddleware'); 
const {uploadFile,uploadResume} =require('../middleware/uploadMiddleware');
  
router.post('/job_posts', authenticate, jobController.createJobPost);
router.get('/job_lists', jobController.getJobListings);
router.get('/employer_jobs', authenticate, jobController.getEmployerJobs);
router.get('/job_posts/:id', jobController.getJobPost);
router.get('/total-jobs',jobController.getTotalJobs);
router.get('/total-employers',jobController.getTotalEmployers);
router.post('/edit_post/:id', authenticate, jobController.editJobPost);
router.delete('/delete/:id', authenticate, jobController.deleteJobPost);
router.post('/apply_job', authenticate,uploadFile, jobController.applyJob);
router.get('/applied_jobs',authenticate,jobController.getAppliedJobs);
router.get('/MyApplication',authenticate,jobController.getMyApplication); 
router.post('/withdraw_application',authenticate,jobController.withdrawApplication); 
router.get('/applicants', authenticate,jobController.getJobApplicants);
router.post('/updateApplicantsStatus', authenticate,jobController.updateApplicationStatus);
router.post('/scheduleInterview', authenticate,uploadFile, jobController.scheduleInterview);
router.get('/interviewCount', authenticate, jobController.getInterviewCount);
router.get('/interviewAlerts', authenticate, jobController.getInterviewAlerts);
router.post('/sendMessage', authenticate, jobController.sendMessage);
router.get('/messages', authenticate, jobController.getMessages);
router.post('/markMessageRead', authenticate, jobController.markMessageRead);
router.post('/confirm-interview', authenticate, jobController.confirmInterview);
router.get('/my-interviews', authenticate, jobController.getInterviews);
router.get('/interview-details', authenticate, jobController.getInterviewDetails);
router.get('/employer-interviews', authenticate, jobController.getEmployerInterviews);
router.post('/markAllMessagesRead', authenticate, jobController.markAllMessagesRead);
router.get('/unreadMessageCount', authenticate, jobController.getUnreadMessageCount);
router.get('/employerInterviewAlerts', authenticate, jobController.getEmployerInterviewAlerts);
router.get('/employerApplicationAlerts', authenticate, jobController.getEmployerApplicationAlerts);
router.get('/employerInterviewCount', authenticate, jobController.getEmployerInterviewCount);
router.get('/employerApplicationCount', authenticate, jobController.getEmployerApplicationCount);
  

module.exports = router;