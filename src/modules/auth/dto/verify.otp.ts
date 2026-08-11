import { IsEmail, IsNotEmpty } from 'class-validator';

export class VerifyOtpDto {
  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'OTP should not be empty' })
  otp: string;
}
