import { Body, Controller, Post } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GmailDto } from './dto/gmail.contact.dto';
import { ForgotPasswordDto } from './dto/forgotpassword.dto';
import { ResetPasswordDto } from './dto/reset.password.dto';

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
  @Post('signup-by-google')
  async signUpByGoogle(@Body() dto: GmailDto) {
    return this.authService.signUpByGoogle(dto);
  }

  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    const { email } = dto;
    await this.authService.forgotPassword(email);
    return {
      message: 'OTP sent to registered email',
    };
  }

  @Public()
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    const res = this.authService.resetPassword(dto);
    return res;
  }
}
