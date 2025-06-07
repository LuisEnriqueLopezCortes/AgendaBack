// middlewares/upload.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'uploads/notas/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `nota_${Date.now()}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });
module.exports = upload;