import {
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Post, Res, Body } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/CreateUserDto';
import { UpdateUserDto } from './dto/UpdateUserDto';
import { ALLOWED_USER, LIMIT, PAGE } from 'src/common/ultis/constants.ulti';
import { PromiseGuard } from 'src/common/guard/promise.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  @UseGuards(PromiseGuard)
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Delete(':id')
  @UseGuards(PromiseGuard)
  async deleteUser(@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Get()
  async getUser(@Query() filter: any) {
    const limit = filter?.limit || LIMIT;
    const page = filter?.page || PAGE;
    const offset = (page - 1) * limit;
    const query = Object.fromEntries(
      Object.entries(filter).filter(
        ([key, value]) => ALLOWED_USER.includes(key) && value !== undefined,
      ),
    );
    return this.userService.getUser(query, limit, offset);
  }

  @Get(':id')
  async findUserById(@Param('id') id: number) {
    return this.userService.findUserById(id);
  }
}
