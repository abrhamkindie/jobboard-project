const express = require('express');
const multer = require('multer');
const { storage } = require('../utils/cloudinary');

const router = express.Router();
const upload = multer({ storage });

// POST /upload
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  res.status(200).json({
    url: req.file.path,
    filename: req.file.filename,
  });
});

module.exports = router;
