import { HttpStatus, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUserDto';
import { updateUserDto } from './dto/updateUserDto';
import { hashPassword } from '../../common/ultis/hashPassword.ulti';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(payload: CreateUserDto) {
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
    const user = this.userRepository.create(payload);
    await this.userRepository.save(user);
    return {
      code: HttpStatus.CREATED,
      message: 'User created successfully',
      data: user,
    };
  }

  async deleteUser(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      return {
        code: HttpStatus.NOT_FOUND,
        message: 'User not found',
      };
    }
    await this.userRepository.remove(user);
    return {
      code: HttpStatus.OK,
      message: 'User deleted successfully',
      data: user,
    };
  }

  async updateUser(id: number, payload: updateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      return {
        code: HttpStatus.NOT_FOUND,
        message: 'User not found',
      };
    }
    Object.assign(user, payload);
    await this.userRepository.save(user);
    return {
      code: HttpStatus.OK,
      message: 'User updated successfully',
      data: user,
    };
  }

  async findUser(filter: string) {
    const query = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.name', 'user.email'])
      .orderBy('user.id', 'DESC');

    Object.entries(filter).forEach(([key, value]) => {
      query.andWhere(`user.${key} LIKE :${key}`, { [key]: `%${value}%` });
    });
    if (!query) {
      return {
        code: HttpStatus.NOT_FOUND,
        message: 'No users found',
      };
    }
    return {
      code: HttpStatus.OK,
      message: 'Users retrieved successfully',
      data: await query.getMany(),
    };
  }
}
