import { IsBoolean } from 'class-validator';

export class ModAction {
  @IsBoolean()
  approve: boolean;

  @IsBoolean()
  deleteApprove: boolean;
}
