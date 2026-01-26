import { IsNotEmpty, MinLength, IsEmail } from 'class-validator';
export class ResetPasswordDto {
  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;
  @IsNotEmpty({ message: 'OTP should not be empty' })
  otp: string;

  @IsNotEmpty({ message: 'New password should not be empty' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  newPassword: string;
}
