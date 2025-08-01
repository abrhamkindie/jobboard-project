// const multer = require('multer');
// const path = require('path');

//  const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, './uploads');  
//   },
//   filename: (req, file, cb) => {
//      cb(null, Date.now() + '-' + file.originalname);
//   },
// });

//  const upload = multer({
//   storage: storage,
//   limits: { fileSize: 5 * 1024 * 1024 },  
//   fileFilter: (req, file, cb) => {
//      const allowedFileTypes = ['image/jpeg', 'image/png', 'application/pdf'];
//     if (allowedFileTypes.includes(file.mimetype)) {
//       cb(null, true); // Accept the file
//     } else {
//       cb(new Error('Invalid file type. Only JPEG, PNG, and PDF files are allowed.'), false);
//     }
//   },
// });





// const uploadFile = upload.single('file');
// const uploadResume = upload.single('resume');

// const uploadMiddleware = (req, res, next) => {
//   console.log('Multer Incoming Request - Body:', req.body);
//   console.log('Multer Incoming Request - Files:', req.files);
//   upload.fields([
//     { name: 'profile', maxCount: 1 },
//     { name: 'resume', maxCount: 1 },
//     { name: 'logo', maxCount: 1 },
//     { name: 'document', maxCount: 1 },
//   ])(req, res, (err) => {
//     if (err instanceof multer.MulterError) {
//       console.error('MulterError:', err);
//       return res.status(400).json({ error: 'File upload error', details: err.message });
//     } else if (err) {
//       console.error('Upload Error:', err);
//       return res.status(400).json({ error: err.message });
//     }
//     next();
//   });
// };

// module.exports = { uploadMiddleware, uploadFile, uploadResume };

 



 
const multer = require("multer");
const { storage, uploadToDrive } = require("../utils/storage");

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];
    if (allowedFileTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, PDF, DOCX, and DOC allowed."), false);
    }
  },
});

const uploadMiddleware = async (req, res, next) => {
  console.log("uploadMiddleware - Incoming Request - Body:", req.body);
  upload.fields([
    { name: "profile", maxCount: 1 },
    { name: "resume", maxCount: 1 },
    { name: "logo", maxCount: 1 },
    { name: "document", maxCount: 1 },
  ])(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      console.error("uploadMiddleware - MulterError:", err);
      return res.status(400).json({ error: "File upload error", details: err.message });
    } else if (err) {
      console.error("uploadMiddleware - Upload Error:", err.message);
      return res.status(400).json({ error: err.message });
    }
    req.files = req.files || {};
    try {
      for (const field in req.files) {
        const file = req.files[field][0];
        req.files[field][0].url = await uploadToDrive(file, field); // Changed .path to .url
        console.log(`uploadMiddleware - Uploaded ${field}:`, req.files[field][0].url);
      }
      console.log("uploadMiddleware - All files processed:", req.files);
      next();
    } catch (err) {
      console.error("uploadMiddleware - Drive Upload Error:", err);
      res.status(500).json({ error: "Failed to upload to Drive", details: err.message });
    }
  });
};

const uploadResume = (req, res, next) => {
  console.log("uploadResume - Incoming Request - Body:", req.body);
  upload.single("resume")(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      console.error("uploadResume - MulterError:", err);
      return res.status(400).json({ error: "File upload error", details: err.message });
    } else if (err) {
      console.error("uploadResume - Upload Error:", err.message);
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      console.error("uploadResume - No resume file provided");
      return res.status(400).json({ error: "Resume file is required" });
    }
    try {
      const fileUrl = await uploadToDrive(req.file, "resume");
      console.log("uploadResume - File uploaded to Drive:", fileUrl);
      req.file.url = fileUrl; // Attach URL for jobController
      next();
    } catch (err) {
      console.error("uploadResume - Drive Upload Error:", err);
      res.status(500).json({ error: "Failed to upload resume to Drive", details: err.message });
    }
  });
};


const uploadFile = (req, res, next) => {
  console.log("uploadFile - Incoming Request - Body:", req.body);
  upload.single("file")(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      console.error("uploadFile - MulterError:", err);
      return res.status(400).json({ error: "File upload error", details: err.message });
    } else if (err) {
      console.error("uploadFile - Upload Error:", err.message);
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      console.error("uploadFile - No file file provided");
      return res.status(400).json({ error: "file file is required" });
    }
    try {
      const fileUrl = await uploadToDrive(req.file, "file");
      console.log("uploadFile - File uploaded to Drive:", fileUrl);
      req.file.url = fileUrl; // Attach URL for jobController
      next();
    } catch (err) {
      console.error("uploadFile - Drive Upload Error:", err);
      res.status(500).json({ error: "Failed to upload file to Drive", details: err.message });
    }
  });
};

//const uploadFile = upload.single("file");
//const uploadResume = upload.single("resume");

module.exports = { uploadMiddleware, uploadFile, uploadResume };

  
 