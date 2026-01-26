import { Body, Controller, Post, UseGuards, Req, Delete } from '@nestjs/common';

import { OnboardingService } from './onboarding.service';
import { NewInviteUser } from './dto/newInviteUser.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../../entity/user.entity';
import { acceptOrRejectInviteDto } from './dto/acceptOrRejectInvite.dto';
@Controller('onboarding')
@UseGuards(JwtAuthGuard)
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post('invite')
  inviteUser(@Body() payload: NewInviteUser, @Req() req: User) {
    const userId = req.id;
    return this.onboardingService.inviteNewUser(payload, userId);
  }

  @Delete('remove-user')
  removeUser(@Body('user_id') user_id: number) {
    return this.onboardingService.delteUser(user_id);
  }

  @Post('accept_or_reject')
  acceptOrRejectInvite(@Body() payload: acceptOrRejectInviteDto) {
    return this.onboardingService.acceptOrRejectInvite(
      payload.invite_id,
      payload.status,
    );
  }
}
