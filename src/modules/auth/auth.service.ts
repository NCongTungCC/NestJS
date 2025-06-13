import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/LoginDto';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';
import { SignUpDto } from './dto/SignUpDto';
import { Token } from './entities/token.entity';
import {
  comparePassword,
  hashPassword,
} from '../../common/ultis/hashPassword.ulti';
import { generateToken } from 'src/common/ultis/generateToken.ulti';
import { SELF_DECLARED_DEPS_METADATA } from '@nestjs/common/constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
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
    const accessToken = await generateToken(user);
    await this.tokenRepository.save({
      userId: user.id,
      token: accessToken,
      expiresAt: new Date(Date.now() + 3600000),
    });
    return {
      code: HttpStatus.OK,
      message: 'Login successful',
      accessToken: accessToken,
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

  async logout(userId: number): Promise<any> {
    await this.tokenRepository.delete({ userId: userId });
    return {
      code: HttpStatus.OK,
      message: 'Logout successful',
    };
  }
}
