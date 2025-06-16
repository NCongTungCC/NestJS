import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/LoginDto';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';
import { SignUpDto } from './dto/SignUpDto';
import { Token } from './entities/token.entity';
import { Role } from '../../common/ultis/constants.ulti';
import {
  comparePassword,
  hashPassword,
} from '../../common/ultis/hashPassword.ulti';
import { generateToken } from 'src/common/ultis/generateToken.ulti';
import { ChangePasswordDto } from './dto/ChangePasswordDto';

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
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
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
    const count = await this.userRepository.count();
    const role = count === 0 ? Role.ADMIN : Role.USER;
    payload.password = await hashPassword(payload.password);
    const newUser = this.userRepository.create({ ...payload, role });
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

  async changePassword(
    userId: number,
    payload: ChangePasswordDto,
  ): Promise<any> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return {
        code: HttpStatus.NOT_FOUND,
        message: 'User not found',
      };
    }
    const isPasswordValid = await comparePassword(
      payload.oldPassword,
      user.password,
    );
    if (!isPasswordValid) {
      return {
        code: HttpStatus.UNAUTHORIZED,
        message: 'Old password is incorrect',
      };
    }
    if (payload.newPassword !== payload.confirmNewPassword) {
      return {
        code: HttpStatus.BAD_REQUEST,
        message: 'New password and confirm password do not match',
      };
    }
    user.password = await hashPassword(payload.newPassword);
    await this.userRepository.save(user);
    return {
      code: HttpStatus.OK,
      message: 'Password changed successfully',
    };
  }
}
