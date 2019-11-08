import { Request } from 'express';
import { MulterFile } from '@services/upload.service';

export interface AuthRequest extends Request {
  user: any;
}

export interface FileRequest extends AuthRequest {
  file: any;
}

export interface FirebaseCustomClaims {
  role: string;
}
