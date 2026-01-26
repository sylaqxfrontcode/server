import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole, UserStatus } from '../../entity/user.entity';
import { LoginDto } from './dto/login.dto';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { GmailDto } from './dto/gmail.contact.dto';
import { NotFoundError } from 'rxjs';
import { otpEntity } from '../../entity/otp.entity';
import { BadRequestException } from '@nestjs/common';
import { resetPassword } from './types/auth.type';
import { registerUser } from './types/auth.type';
@Injectable()
export class AuthService {
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
    // Login logic would go here
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) {
      throw new Error('Please register first');
    }
    const isMatch = await bcrypt.compare(dto.password, user.password_hash);

    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const payload = { sub: user.name, email: user.email };

    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
    };
  }

  async signUpByGoogle(dto: GmailDto) {
    const user = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    const salt = await bcrypt.genSalt();
    const password_hash = await bcrypt.hash('123456', salt);
    if (!user) {
      const newUser = this.userRepo.create({
        email: dto.email,
        name: dto.name,
        status: UserStatus.ACTIVE,
        role: UserRole.ADMIN,
        password_hash: password_hash,
      });

      const savedUser = await this.userRepo.save(newUser);
      return this.jwtService.signAsync({
        sub: savedUser.name,
        email: savedUser.email,
      });
    } else {
      const findUser = await this.userRepo.findOne({
        where: { email: dto.email, name: dto.name },
      });

      if (!findUser) {
        throw new Error('User not found with the provided email and name');
      }
      return this.jwtService.signAsync({
        sub: findUser.name,
        email: findUser.email,
      });
    }
  }

  async forgotPassword(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundError('User with the given email does not exist');
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

    // Optional: send OTP via email here
  }
  async resetPassword(dto: resetPassword) {
    const { email, otp, newPassword } = dto;

    // 1️⃣ Find user
    const user = await this.userRepo.findOne({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user) {
      throw new NotFoundError('User with the given email does not exist');
    }

    // 2️⃣ Find OTP
    const otpRecord = await this.otpRepo.findOne({
      where: { user_id: user.id },
    });

    if (!otpRecord) {
      throw new NotFoundError('OTP not found for the user');
    }

    // 3️⃣ Validate OTP
    if (String(otpRecord.otp_code) !== String(otp).trim()) {
      throw new BadRequestException('Invalid OTP');
    }

    // 4️⃣ Validate expiry
    if (Date.now() > Number(otpRecord.otp_expires)) {
      throw new BadRequestException('OTP has expired');
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
}
