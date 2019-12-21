import {
  IsInt,
  IsString,
  IsPositive,
  IsIn,
  IsArray,
  IsNotEmpty,
  IsAlpha,
  IsOptional,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import constants from '@constants';
import toArry from '@utils/to-array';
import { MulterFile } from '@services/upload.service';

const allowedHealth = toArry(constants.treeHealth);
const allowedTreeDistributions = toArry(constants.treeDistribution);

class TreePoint {
  lat: number;
  lng: number;
}

export class CreateTreeGroup {
  @IsString()
  @IsIn(allowedHealth)
  health: string;

  @IsString()
  @IsIn(allowedTreeDistributions)
  distribution: string;

  @Type(() => TreePoint)
  @Transform((value) => JSON.parse(value))
  @IsArray()
  trees: TreePoint[];

  @IsInt()
  @IsPositive()
  @Type(() => Number)
  @Transform((value) => Number(value))
  waterCycle: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsAlpha()
  plantType: string;
}
