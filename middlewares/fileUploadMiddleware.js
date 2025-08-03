const multer = require("multer");
const path = require("path");
const fs = require("fs");

//storing files in the server
function getFolderByItsMimeType(mimeType) {
  if (mimeType.startsWith("image/")) return "uploads/images";
  if (mimeType === "application/pdf") return "uploads/pdfs";
  if (mimeType === "application/msword") return "uploads/docs";
  if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") return "uploads/docs";
  if (mimeType === "application/vnd.ms-excel") return "uploads/excels";
  if (mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") return "uploads/excels";
  if (mimeType === "application/zip") return "uploads/zips";
  return "uploads/others";
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = getFolderByItsMimeType(file.mimetype);
    // Ensure the folder exists, create it if it doesn't
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
    //otherwise, save the folder
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const folder = getFolderByItsMimeType(file.mimetype);
    const filePath = path.join(folder, file.originalname);
    // Check if the file already exists
    if (fs.existsSync(filePath)) {
      return cb(new Error("File already exists"))
    }
  cb(null, file.originalname); // Save with original name
  },
});

const upload = multer({ storage });

module.exports = upload;
