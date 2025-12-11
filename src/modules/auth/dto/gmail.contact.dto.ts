import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class GmailDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
