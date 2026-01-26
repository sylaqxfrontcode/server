import { IsNotEmpty, IsNumber, IsString, IsArray } from 'class-validator';

export class NewInviteUser {
  @IsNotEmpty()
  @IsString()
  new_user_email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  countryCode: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  company_id: number;

  @IsArray()
  permissions: number[];
}
