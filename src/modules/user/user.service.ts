import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUserDto';
import { updateUserDto } from './dto/updateUserDto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(payload: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(payload);
    await this.userRepository.save(user);
    return user;
  }

  async deleteUser(id: number): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      return null;
    }
    await this.userRepository.remove(user);
    return user;
  }

  async updateUser(id: number, payload: updateUserDto): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      return null;
    }
    Object.assign(user, payload);
    await this.userRepository.save(user);
    return user;
  }
}
