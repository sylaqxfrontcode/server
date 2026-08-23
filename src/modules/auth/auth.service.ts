import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole, UserStatus } from '../../entity/user.entity';
import { LoginDto } from './dto/login.dto';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { otpEntity } from '../../entity/otp.entity';
import { BadRequestException } from '@nestjs/common';
import { resetPassword } from './types/auth.type';
import { registerUser } from './types/auth.type';
import { OAuth2Client } from 'google-auth-library';
import { sendOtpEmail } from '../../helper/mail/otp/otp';

@Injectable()
export class AuthService {
  private client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(otpEntity)
    private readonly otpRepo: Repository<otpEntity>,
    private jwtService: JwtService,
  ) {}

  async registerUser(dto: registerUser): Promise<User> {
    try {
      const salt = await bcrypt.genSalt();
      const password_hash = await bcrypt.hash(dto.password, salt);

      const newUser = this.userRepo.create({
        email: dto.email,
        name: dto.name,
        password_hash,
        status: UserStatus.PENDING,
        role: UserRole.MEMBER,
        phone: dto.phone,
        countryCode: dto.countryCode,
      });

      return await this.userRepo.save(newUser);
    } catch (err) {
      console.error('Error registering user:', err);
      throw err; // rethrow after logging
    }
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      throw new NotFoundException('Please register first');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password_hash);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    try {
      const payload = { sub: user.id, email: user.email, role: user.role };

      const token = await this.jwtService.signAsync(payload);

      return {
        access_token: token,
        user: this.toPublicUser(user),
      };
    } catch (err) {
      console.error('Error during login:', err);
      throw err; // rethrow after logging
    }
  }

  async signUpByGoogle(token: string) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();

      if (!payload?.email) {
        throw new UnauthorizedException(
          'Google authentication failed: No email found',
        );
      }
      let user = await this.userRepo.findOne({
        where: { email: payload.email },
      });
      if (!user) {
        user = this.userRepo.create({
          email: payload.email,
          name: payload.name || 'Google User',
          password_hash: '', // No password for Google users
          status: UserStatus.ACTIVE,
          phone: '', // Optional: you can choose to leave this empty or ask for it later
          countryCode: '', // Optional: you can choose to leave this empty or ask for it later
        });
        user = await this.userRepo.save(user);
      }
      const jwtPayload = { sub: user.id, email: user.email, role: user.role };
      const jwtToken = await this.jwtService.signAsync(jwtPayload);
      return {
        access_token: jwtToken,
        user: this.toPublicUser(user),
      };
    } catch (err: unknown) {
      console.error('Error during Google sign-up:', err);
      throw new UnauthorizedException('Google authentication failed');
    }
  }

  async forgotPassword(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User with the given email does not exist');
    }

    // Generate 6-digit OTP
    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // OTP expires in 4 minutes
    const otpExpires = Date.now() + 4 * 60 * 1000;

    const otpEntity = this.otpRepo.create({
      user_id: user.id,
      otp_code: resetOtp,
      otp_expires: otpExpires,
      created_at: Date.now(),
    });

    await this.otpRepo.save(otpEntity);
    await sendOtpEmail(user.email, resetOtp);
  }
  async verifyOtp(email: string, otp: string) {
    const user = await this.userRepo.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const otpRecord = await this.otpRepo.findOne({
      where: { user_id: user.id },
    });

    if (!otpRecord) {
      throw new NotFoundException('OTP not found for the user');
    }

    // Check expiry first (better UX + security)
    if (Date.now() > Number(otpRecord.otp_expires)) {
      throw new BadRequestException('OTP has expired');
    }

    // Validate OTP
    if (String(otpRecord.otp_code) !== String(otp).trim()) {
      throw new BadRequestException('Invalid OTP');
    }

    return {
      verified: true,
      message: 'OTP verified successfully',
    };
  }
  async resetPassword(dto: resetPassword) {
    const { email, otp, newPassword } = dto;

    // 1️⃣ Find user
    const user = await this.userRepo.findOne({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user) {
      throw new NotFoundException('User with the given email does not exist');
    }

    const otpRecord = await this.otpRepo.findOne({
      where: { user_id: user.id, otp_code: String(otp).trim() },
    });
    if (!otpRecord || Date.now() > Number(otpRecord.otp_expires)) {
      throw new BadRequestException('OTP is invalid or has expired');
    }

    // 5️⃣ Validate password
    if (newPassword.length < 8) {
      throw new BadRequestException(
        'Password must be at least 8 characters long',
      );
    }

    // 6️⃣ Hash & save
    user.password_hash = await bcrypt.hash(newPassword, 10);

    await this.userRepo.manager.transaction(async (manager) => {
      await manager.save(user);
      await manager.delete(otpEntity, { user_id: user.id });
    });

    return {
      message: 'Password reset successful',
    };
  }

  async registerAndAuthenticate(dto: registerUser) {
    const user = await this.registerUser(dto);
    const access_token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return { access_token, user: this.toPublicUser(user) };
  }

  private toPublicUser(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      countryCode: user.countryCode,
      status: user.status,
      role: user.role,
    };
  }
}
