import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/LoginDto';
import { Response, Request } from 'express';
import { SignUpDto } from './dto/SignUpDto';
import { PromiseGuard } from 'src/common/guard/promise.guard';

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

  @Get('logout')
  @UseGuards(PromiseGuard)
  async logout(@Req() req: Request, @Res() res: Response): Promise<any> {
    const result = await this.authService.logout(req.user.id);
    return res.status(result.code).json(result);
  }
}
