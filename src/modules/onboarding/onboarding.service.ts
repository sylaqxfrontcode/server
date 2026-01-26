import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { inviteNewUser } from './../../entity/invite_new_user.entity';
import { inviteNewUserType } from '../onboarding/types/type';
import { Company } from '../../entity/company.entity';
import { User, UserStatus } from '../../entity/user.entity';
import { AuthService } from '../auth/auth.service'; // ✅ IMPORT AUTH SERVICE
import { UserPermission } from './../../entity/user_permission.entity';

@Injectable()
export class OnboardingService {
  constructor(
    @InjectRepository(inviteNewUser)
    private readonly onboardingRepo: Repository<inviteNewUser>,

    @InjectRepository(Company) // ✅ REQUIRED
    private readonly companyRepo: Repository<Company>,

    @InjectRepository(User) // ✅ REQUIRED
    private readonly userRepo: Repository<User>,

    @InjectRepository(UserPermission)
    private readonly userPermissionRepo: Repository<UserPermission>,

    private readonly authService: AuthService, // ✅ NOW TYPED
  ) {}

  async inviteNewUser(payload: inviteNewUserType, user_id: number) {
    try {
      const company = await this.companyRepo.findOne({
        where: { id: payload.company_id },
        select: ['id'],
      });

      if (!company) {
        throw new Error('Company not found');
      }

      const existingUser = await this.userRepo.findOne({
        where: { email: payload.new_user_email },
      });

      if (existingUser) {
        throw new Error('User already exists');
      }

      const userPayload = {
        email: payload.new_user_email,
        name: payload.name,
        password: 'Pass@1234', // ⚠️ temp only
        phone: payload.phone,
        countryCode: payload.countryCode,
        company_id: payload.company_id,
      };

      // 🔥 FIX HERE
      const createdUser = await this.authService.registerUser(userPayload);

      const invite = this.onboardingRepo.create({
        invite_id: user_id,
        new_user_email: payload.new_user_email,
        company_id: payload.company_id,
      });

      const permissions = payload.permissions;
      for (const perm of permissions) {
        const userPermission = {
          user_id: createdUser.id,
          permission_id: perm,
        };
        await this.userPermissionRepo.save(userPermission);
      }
      await this.onboardingRepo.save(invite);

      return {
        message: 'User invited successfully',
        userId: createdUser.id,
        companyId: payload.company_id,
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Error inviting new user:', err.message);
        throw err;
      }
      throw new Error('Unexpected error while inviting user');
    }
  }

  async delteUser(user_id: number) {
    const user = await this.userRepo.findOne({ where: { id: user_id } });
    if (!user) {
      new NotFoundException();
    }
    await this.userRepo.delete({ id: user_id });
    return { message: 'User deleted successfully' };
  }
  async acceptOrRejectInvite(user_id: number, status: string) {
    const user = await this.userRepo.findOne({ where: { id: user_id } });

    if (!user) {
      new NotFoundException('user not found');
    }

    const invite_user = await this.onboardingRepo.findOne({
      where: { new_user_id: user_id },
    });
    if (!invite_user) {
      throw new NotFoundException('Invite not found for this user');
    }
    if (status === 'accepted' && user) {
      user.status = UserStatus.ACTIVE;
      await this.userRepo.save(user);
    }

    invite_user.status = status;
    await this.onboardingRepo.save(invite_user);
    return { message: `Invite ${status} successfully` };
  }
}
