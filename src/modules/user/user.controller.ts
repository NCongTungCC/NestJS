import { Controller, Delete, HttpStatus, Param, Put } from '@nestjs/common';
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
    const users = await this.userService.createUser(createUserDto);
    return res.status(HttpStatus.CREATED).json({
      code: HttpStatus.CREATED,
      message: 'User created successfully',
      data: users,
    });
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number, @Res() res: Response) {
    const user = await this.userService.deleteUser(id);
    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({
        code: HttpStatus.NOT_FOUND,
        message: 'User not found',
      });
    }
    return res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      message: 'User deleted successfully',
      data: user,
    });
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: updateUserDto,
    @Res() res: Response,
  ) {
    const user = await this.userService.updateUser(id, updateUserDto);
    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({
        code: HttpStatus.NOT_FOUND,
        message: 'User not found',
      });
    }
    return res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      message: 'User updated successfully',
      data: user,
    });
  }
}
