const { google } = require("googleapis");
const multer = require("multer");
const stream = require("stream");

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});

const drive = google.drive({ version: "v3", auth });

const storage = multer.memoryStorage();

const uploadToDrive = async (file, fieldname) => {
  const ext = file.originalname.split(".").pop();
  const fileName = `${fieldname}-${Date.now()}.${ext}`;
  const fileMetadata = {
    name: fileName,
    parents: [process.env.DRIVE_FOLDER_ID],
  };
  const bufferStream = new stream.PassThrough();
  bufferStream.end(file.buffer);
  const media = {
    mimeType: file.mimetype,
    body: bufferStream,
  };

  try {
    const { data } = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: "id, webViewLink",
    });
    await drive.permissions.create({
      fileId: data.id,
      requestBody: { role: "reader", type: "anyone" },
    });
    return data.webViewLink;
  } catch (err) {
    throw new Error(`Drive upload failed: ${err.message}`);
  }
};

module.exports = { storage, uploadToDrive };