import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/CreateUserDto';
import { UpdateUserDto } from './dto/UpdateUserDto';
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
    if (existingUser) throw new ConflictException('Email already exists');
    payload.password = await hashPassword(payload.password);
    const user = this.userRepository.create(payload);
    await this.userRepository.save(user);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User created successfully',
      data: user,
    };
  }
  async deleteUser(id: number) {
    const user = await this.checkUser(id);
    await this.userRepository.remove(user);
    return {
      statusCode: HttpStatus.OK,
      message: 'User deleted successfully',
      data: user,
    };
  }

  async updateUser(id: number, payload: UpdateUserDto) {
    const user = await this.checkUser(id);
    Object.assign(user, payload);
    await this.userRepository.save(user);
    return {
      statusCode: HttpStatus.OK,
      message: 'User updated successfully',
      data: user,
    };
  }

  async getUser(query: any, limit: number, offset: number) {
    const querry = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.name', 'user.email'])
      .take(limit)
      .skip(offset)
      .orderBy('user.id', 'DESC');

    Object.entries(query).forEach(([key, value]) => {
      querry.andWhere(`user.${key} LIKE :${key}`, { [key]: `%${value}%` });
    });
    const users = await querry.getMany();
    if (!users || users.length === 0)
      throw new NotFoundException('No users found');
    return {
      statusCode: HttpStatus.OK,
      message: 'Users retrieved successfully',
      data: users,
    };
  }

  async findUserById(id: number) {
    const user = await this.checkUser(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'User retrieved successfully',
      data: user,
    };
  }

  async checkUser(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
