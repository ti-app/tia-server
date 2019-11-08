import { Request } from 'express';
import { CreateTreeGroup } from '@models/TreeGroup';

export interface AuthRequest extends Request {
  user: any;
}

export interface FileRequest extends AuthRequest {
  file: any;
}

export interface CreateTreeGroupRequest extends FileRequest {
  body: CreateTreeGroup;
}
