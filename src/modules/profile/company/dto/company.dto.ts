import { IsNotEmpty, IsString } from 'class-validator';

export class CompanyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  work_mail: string;

  @IsNotEmpty()
  @IsString()
  owner_id: number;
}
