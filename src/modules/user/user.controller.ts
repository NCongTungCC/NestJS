import { Controller, Delete, Get, Param, Put, Query } from '@nestjs/common';
import { Post, Res, Body } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUserDto';
import { updateUserDto } from './dto/updateUserDto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const result = await this.userService.createUser(createUserDto);
    return res.status(result.code).json(result);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number, @Res() res: Response) {
    const result = await this.userService.deleteUser(id);
    return res.status(result.code).json(result);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: updateUserDto,
    @Res() res: Response,
  ) {
    const result = await this.userService.updateUser(id, updateUserDto);
    return res.status(result.code).json(result);
  }

  @Get()
  async findUser(@Res() res: Response, @Query() filter: string) {
    const result = await this.userService.findUser(filter);
    return res.status(result.code).json(result);
  }

  @Get(':id')
  async findUserById(@Param('id') id: number, @Res() res: Response) {
    const result = await this.userService.findUserById(id);
    return res.status(result.code).json(result);
  }
}
