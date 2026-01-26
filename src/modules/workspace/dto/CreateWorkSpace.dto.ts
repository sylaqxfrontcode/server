import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateWorkSpaceDto {
  @IsNotEmpty()
  @IsNumber()
  Company_id: number;
  @IsNotEmpty()
  @IsNumber()
  user_id: number;
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;
  @IsOptional()
  @IsString()
  remarks: string;
  @IsOptional()
  @IsNumber()
  status: number;
}
