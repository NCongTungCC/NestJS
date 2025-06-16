import { Controller, Post, Body, Res, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/LoginDto';
import { Response, Request } from 'express';
import { SignUpDto } from './dto/SignUpDto';
import { ChangePasswordDto } from './dto/ChangePasswordDto';

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
    @Body() signUpDto: SignUpDto,
    @Res() res: Response,
  ): Promise<any> {
    const result = await this.authService.signup(signUpDto);
    return res.status(result.code).json(result);
  }

  @Get('logout')
  async logout(@Req() req: Request, @Res() res: Response): Promise<any> {
    const result = await this.authService.logout(req.user.id);
    return res.status(result.code).json(result);
  }

  @Post('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    const result = await this.authService.changePassword(
      req.user.id,
      changePasswordDto,
    );
    return res.status(result.code).json(result);
  }
}
