import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateWorkSpaceDto {
  @IsNotEmpty()
  @IsNumber()
  company_id: number;
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
