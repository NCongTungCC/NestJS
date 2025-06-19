import {
  Controller,
  Post,
  Req,
  Param,
  Put,
  UseGuards,
  Get,
  Query,
} from '@nestjs/common';
import { BorrowService } from './borrow.service';
import { Request } from 'express';
import { RolesGuard } from 'src/common/guard/promise.guard';
import { Roles } from 'src/common/guard/role.decorator';
import { LIMIT, PAGE } from 'src/common/ultis/constants.ulti';

@Controller()
export class BorrowController {
  constructor(private readonly borrowService: BorrowService) {}

  @Post('books/:id/borrow')
  async borrowBook(@Param('id') id: number, @Req() req: Request) {
    const userId = req.user.id;
    return this.borrowService.borrowBook(userId, id);
  }

  @Put('borrows/:id/return')
  async returnBook(@Param('id') borrowId: number) {
    return this.borrowService.returnBook(borrowId);
  }

  @Put('borrows/:id/approve')
  @Roles('admin', 'manager')
  @UseGuards(RolesGuard)
  async approveBorrow(@Param('id') borrowId: number) {
    return this.borrowService.approveBorrow(borrowId);
  }

  @Get('books/borrowed')
  async getBorrowedBooks(@Req() req: Request, @Query() query: any) {
    const userId = req.user.id;
    const limit = query.limit || LIMIT;
    const page = query.page || PAGE;
    const offset = (page - 1) * limit;
    return this.borrowService.getBorrowedBooks(userId, limit, offset);
  }
}
