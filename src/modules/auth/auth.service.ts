import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/LoginDto';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async login(payload: LoginDto): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email: payload.email },
    });
    if (!user) {
      return {
        code: HttpStatus.UNAUTHORIZED,
        message: 'Invalid credentials',
      };
    }
    if (user.password !== payload.password) {
      return {
        code: HttpStatus.UNAUTHORIZED,
        message: 'Invalid credentials',
      };
    }
    return {
      code: HttpStatus.OK,
      message: 'Login successful',
    };
  }
}
