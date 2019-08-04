const admin = require('firebase-admin');
const constants = require('../../constants');
const firebase = require('firebase');
const { Storage } = require('@google-cloud/storage');

class UploadService {
  getGoogleStorage() {
    const storage = new Storage({
      projectId: constants.firebase.firebaseServiceAccount.project_id,
      credentials: constants.firebase.firebaseServiceAccount,
    });
    const bucket = storage.bucket(constants.firebase.firebaseServiceAccount.bucket_id);
    return bucket;
  }

  uploadImageToStorage(file) {
    const bucket = this.getGoogleStorage();
    const prom = new Promise((resolve, reject) => {
      if (!file) {
        reject('No image file');
      }

      const newFileName = `${file.originalname}_${Date.now()}`;

      const fileUpload = bucket.file(newFileName);

      const blobStream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });

      blobStream.on('error', (error) => {
        reject('Something is wrong! Unable to upload at the moment.');
      });

      blobStream.on('finish', () => {
        // The public URL can be used to directly access the file via HTTP.
        const url = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
        resolve(url);
      });

      blobStream.end(file.buffer);
    });
    return prom;
  }
}

module.exports = new UploadService();
