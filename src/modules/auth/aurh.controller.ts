import { Body, Controller, Post } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GmailDto } from './dto/gmail.contact.dto';

@Controller('auth')
export class AuthController {
  // Controller methods would go here
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() dto: RegisterUserDto) {
    return this.authService.registerUser(dto);
  }

  @Public()
  @Post('login')
  async login(@Body() dto: LoginDto) {
    // Login logic would go here
    return this.authService.login(dto);
  }

  @Public()
  @Post('signup-by-contact')
  async signUpByGoogle(@Body() dto: GmailDto) {
    return this.authService.signUpByGoogle(dto);
  }
}
