import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole, UserStatus } from '../../entity/user.entity';
import { RegisterUserDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { GmailDto } from './dto/gmail.contact.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async registerUser(dto: RegisterUserDto): Promise<User> {
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
}
