import { Storage } from '@google-cloud/storage';
import constants from '@constants';

export interface MulterFile {
  key: string;
  path: string;
  mimetype: string;
  originalname: string;
  size: number;
}

class UploadService {
  getGoogleStorage() {
    const storage = new Storage({
      projectId: constants.firebase.firebaseServiceAccount.projectId,
      credentials: {
        client_email: constants.firebase.firebaseServiceAccount.clientEmail,
        private_key: constants.firebase.firebaseServiceAccount.privateKey,
      },
    });
    const bucket = storage.bucket(constants.firebase.firebaseServiceAccount.bucketId);
    return bucket;
  }

  uploadImageToStorage(file: MulterFile): Promise<{ url: string; fileName: string }> {
    const bucket = this.getGoogleStorage();
    return new Promise((resolve, reject) => {
      if (!file) {
        reject('No image file');
      }

      const newFileName = `${file.originalname}-${Date.now()}`;

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
        resolve({ url, fileName: fileUpload.name });
      });

      // blobStream.end(file.buffer);
      blobStream.end();
    });
  }

  deleteImage(imageName: string) {
    const bucket = this.getGoogleStorage();
    return bucket.file(imageName).delete();
  }
}

export default new UploadService();
