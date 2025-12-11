import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;
  @IsNotEmpty({ message: 'Name should not be empty' })
  @IsString({ message: 'Name must be a string' })
  name: string;
  @IsNotEmpty({ message: 'Password should not be empty' })
  @IsString({ message: 'Password must be a string' })
  password: string;
  @IsString({ message: 'Phone must be a string' })
  @IsNotEmpty({ message: 'Phone should not be empty' })
  phone: string;
  @IsString({ message: 'Country code must be a string' })
  @IsNotEmpty({ message: 'Country code should not be empty' })
  countryCode: string;
}
