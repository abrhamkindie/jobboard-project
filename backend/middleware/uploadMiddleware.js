const multer = require('multer');
const path = require('path');

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Save files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    // Generate a unique filename with a timestamp and original extension
    cb(null, Date.now() + '-' + file.originalname);
  },
});

// Configure Multer with storage and file size limits
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: (req, file, cb) => {
    // Validate file types (optional)
    const allowedFileTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedFileTypes.includes(file.mimetype)) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and PDF files are allowed.'), false);
    }
  },
});





const uploadFile = upload.single('file');
const uploadResume = upload.single('resume');

const uploadMiddleware = (req, res, next) => {
  console.log('Multer Incoming Request - Body:', req.body);
  console.log('Multer Incoming Request - Files:', req.files);
  upload.fields([
    { name: 'profile', maxCount: 1 },
    { name: 'resume', maxCount: 1 },
    { name: 'logo', maxCount: 1 },
    { name: 'document', maxCount: 1 },
  ])(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error('MulterError:', err);
      return res.status(400).json({ error: 'File upload error', details: err.message });
    } else if (err) {
      console.error('Upload Error:', err);
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

module.exports = { uploadMiddleware, uploadFile, uploadResume };

 

// // Middleware for handling multiple file uploads
// module.exports.uploadMiddleware = upload.fields([
//   { name: 'profile', maxCount: 1 },  
//   { name: 'resume', maxCount: 1 },    
//   { name: 'logo', maxCount: 1 },    
//   { name: 'document', maxCount: 1 },    

// ]);

//  module.exports.uploadSingle = upload.single('resume');


  

 





 