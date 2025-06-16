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
import { LIMIT, PAGE } from 'src/common/ultis/constants.ulti';
import { PromiseGuard } from 'src/common/guard/promise.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  @UseGuards(PromiseGuard)
  async createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const result = await this.userService.createUser(createUserDto);
    return res.status(result.code).json(result);
  }

  @Delete(':id')
  @UseGuards(PromiseGuard)
  async deleteUser(@Param('id') id: number, @Res() res: Response) {
    const result = await this.userService.deleteUser(id);
    return res.status(result.code).json(result);
  }

  @Put(':id')
  @UseGuards(PromiseGuard)
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    const result = await this.userService.updateUser(id, updateUserDto);
    return res.status(result.code).json(result);
  }

  @Get()
  async getUser(@Res() res: Response, @Query() filter: any) {
    const limit = filter?.limit || LIMIT;
    const page = filter?.page || PAGE;
    const offset = (page - 1) * limit;
    const query = Object.fromEntries(
      Object.entries(filter).filter(
        ([key, _]) => key !== 'limit' && key !== 'page',
      ),
    );
    const result = await this.userService.getUser(query, limit, offset);
    return res.status(result.code).json(result);
  }

  @Get(':id')
  async findUserById(@Param('id') id: number, @Res() res: Response) {
    const result = await this.userService.findUserById(id);
    return res.status(result.code).json(result);
  }
}
