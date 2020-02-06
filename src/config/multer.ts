import path from 'path';
import Multer from 'multer';
import httpStatus from 'http-status';

import APIError from '../api/utils/APIError';

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

    return cb(
      new APIError({
        message: `Image upload only supports the following filetypes - ${allowedTypesRegex}`,
        status: httpStatus.BAD_REQUEST,
      })
    );
  },
});

export default multer;
