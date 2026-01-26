import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { inviteNewUser } from '../../entity/invite_new_user.entity';
import { Company } from '../../entity/company.entity';
import { User } from '../../entity/user.entity';

import { OnboardingService } from './onboarding.service';
import { OnboardingController } from './onboarding.controller';
import { AuthModule } from '../auth/auth.module'; // ✅ IMPORT THIS
import { UserPermission } from '../../entity/user_permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([inviteNewUser, Company, User, UserPermission]),
    AuthModule, // 🔥 REQUIRED for AuthService injection
  ],
  providers: [OnboardingService],
  controllers: [OnboardingController],
  exports: [OnboardingService],
})
export class OnboardingModule {}
