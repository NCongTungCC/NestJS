import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/LoginDto';
import { Response } from 'express';
import { SignUpDto } from './dto/SignUpDto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response): Promise<any> {
    const result = await this.authService.login(loginDto);
    return res.status(result.code).json(result);
  }

  @Post('signup')
  async signup(
    @Body() SignUpDto: SignUpDto,
    @Res() res: Response,
  ): Promise<any> {
    const result = await this.authService.signup(SignUpDto);
    return res.status(result.code).json(result);
  }
}
