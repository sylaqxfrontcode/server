import { IsNotEmpty, IsString } from 'class-validator';

export class ContactDto {
  @IsNotEmpty({ message: 'Contact should not be empty' })
  @IsString({ message: 'Contact must be a string' })
  contact: string;
}
