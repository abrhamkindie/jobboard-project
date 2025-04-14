const multer = require("multer");
const { storage, uploadToDrive } = require("../utils/storage");

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowedFileTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, PDF, and DOCX allowed."), false);
    }
  },
});

const uploadMiddleware = async (req, res, next) => {
  console.log("Multer Incoming Request - Body:", req.body);
  upload.fields([
    { name: "profile", maxCount: 1 },
    { name: "resume", maxCount: 1 },
    { name: "logo", maxCount: 1 },
    { name: "document", maxCount: 1 },
  ])(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      console.error("MulterError:", err);
      return res.status(400).json({ error: "File upload error", details: err.message });
    } else if (err) {
      console.error("Upload Error:", err);
      return res.status(400).json({ error: err.message });
    }
    req.files = req.files || {};
    try {
      for (const field in req.files) {
        const file = req.files[field][0];
        req.files[field][0].path = await uploadToDrive(file, field);
      }
      console.log("Uploaded Files:", req.files);
      next();
    } catch (err) {
      console.error("Drive Upload Error:", err);
      res.status(500).json({ error: "Failed to upload to Drive", details: err.message });
    }
  });
};

module.exports = { uploadMiddleware };