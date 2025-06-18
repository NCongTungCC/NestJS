import { Controller, Post, Body, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { LoginDto } from './dto/LoginDto';
import { SignUpDto } from './dto/SignUpDto';
import { ChangePasswordDto } from './dto/ChangePasswordDto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<any> {
    return this.authService.login(loginDto);
  }
  @Post('signup')
  async signup(@Body() signUpDto: SignUpDto): Promise<any> {
    const emailCheckResult = await this.authService.checkEmail(signUpDto);
    if (emailCheckResult !== true) {
      return emailCheckResult;
    }
    return this.authService.signup(signUpDto);
  }

  @Get('logout')
  async logout(@Req() req: Request): Promise<any> {
    return this.authService.logout(req.user.id);
  }

  @Post('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: Request,
  ): Promise<any> {
    return this.authService.changePassword(req.user.id, changePasswordDto);
  }
}
