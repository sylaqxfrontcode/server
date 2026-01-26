import { IsNotEmpty, IsNumber } from 'class-validator';

export class acceptOrRejectInviteDto {
  @IsNotEmpty()
  @IsNumber()
  invite_id: number;
  @IsNotEmpty()
  @IsNumber()
  status: string;
}
