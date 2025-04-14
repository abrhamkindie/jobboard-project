const express = require("express");
const multer = require("multer");
const { storage, uploadToDrive } = require("../utils/storage");

const router = express.Router();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
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

router.post("/", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  try {
    const url = await uploadToDrive(req.file, "file");
    res.status(200).json({
      url,
      filename: req.file.originalname,
    });
  } catch (err) {
    console.error("Drive Upload Error:", err);
    res.status(500).json({ error: "Failed to upload to Drive", details: err.message });
  }
});

module.exports = router;