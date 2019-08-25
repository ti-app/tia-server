const path = require('path');
const Multer = require('multer');

const allowedTypesRegex = /jpeg|jpg|png/;

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
  fileFilter: (req, file, cb) => {
    const mimetype = allowedTypesRegex.test(file.mimetype);
    const extname = allowedTypesRegex.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    return cb(`Error: File upload only supports the following filetypes - ${allowedTypesRegex}`);
  },
});

module.exports = multer;
