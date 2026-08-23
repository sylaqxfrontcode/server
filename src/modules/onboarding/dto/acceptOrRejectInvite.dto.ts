import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class acceptOrRejectInviteDto {
  @IsNotEmpty()
  @IsNumber()
  invite_id: number;
  @IsNotEmpty()
  @IsString()
  status: string;
}
