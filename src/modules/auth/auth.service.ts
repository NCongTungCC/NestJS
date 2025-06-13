import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/LoginDto';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';
import { SignUpDto } from './dto/SignUpDto';
import {
  comparePassword,
  hashPassword,
} from '../../common/ultis/hashPassword.ulti';

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

    const isPasswordValid = await comparePassword(
      payload.password,
      user.password,
    );
    if (!isPasswordValid) {
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

  async signup(payload: SignUpDto): Promise<any> {
    const existingUser = await this.userRepository.findOne({
      where: { email: payload.email },
    });
    if (existingUser) {
      return {
        code: HttpStatus.CONFLICT,
        message: 'User already exists',
      };
    }
    payload.password = await hashPassword(payload.password);
    const newUser = this.userRepository.create(payload);
    await this.userRepository.save(newUser);
    return {
      code: HttpStatus.CREATED,
      message: 'User created successfully',
      data: newUser,
    };
  }
}
