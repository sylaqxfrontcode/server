import { IsEmail, IsInt, IsOptional, IsString, Length } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @Length(1, 255)
  name: string;

  @IsEmail()
  @Length(1, 255)
  companyEmail: string;

  @IsOptional()
  @IsString()
  @Length(1, 26)
  companyContactNo: string;

  @IsOptional()
  @IsString()
  @Length(1, 10)
  contactCountryCode: string;

  @IsOptional()
  @IsString()
  @Length(1, 15)
  companyType: string;

  @IsOptional()
  @IsString()
  @Length(1, 15)
  registrationNumber: string;

  @IsInt()
  status: number;
}
