import { Body, Controller, Post } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgotpassword.dto';
import { ResetPasswordDto } from './dto/reset.password.dto';
import { VerifyOtpDto } from './dto/verify.otp';
@Controller('auth')
export class AuthController {
  // Controller methods would go here
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() dto: RegisterUserDto) {
    return this.authService.registerAndAuthenticate(dto);
  }

  @Public()
  @Post('login')
  async login(@Body() dto: LoginDto) {
    // Debug log to check incoming data
    return this.authService.login(dto);
  }

  @Public()
  @Post('google')
  async signUpByGoogle(@Body('token') token: string) {
    return this.authService.signUpByGoogle(token);
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
  @Post('verify-otp')
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto.email, dto.otp);
  }

  @Public()
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    const res = this.authService.resetPassword(dto);
    return res;
  }
}
