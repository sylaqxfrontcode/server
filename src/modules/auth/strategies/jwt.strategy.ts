import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../entity/user.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from '../types/auth.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {
    const SECRET_KEY = process.env.Jwt_SECRET;

    if (!SECRET_KEY) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const options: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: SECRET_KEY,
    };
    super(options);
  }

  async validate(payload: JwtPayload) {
    const user = await this.userRepo.findOne({
      where: { id: payload.sub },
      select: ['id', 'email', 'name', 'role', 'status'],
    });
    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }
    return user;
  }
}
