import { Request } from 'express';
import { CreateTreeGroup } from '@models/TreeGroup';
import { ModAction } from '@models/ModAction';

export interface AuthRequest extends Request {
  user: any;
}

export interface FileRequest extends AuthRequest {
  file: any;
}

export interface CreateTreeGroupRequest extends FileRequest {
  body: CreateTreeGroup;
}

export interface ModActionRequest extends AuthRequest {
  body: ModAction;
}
