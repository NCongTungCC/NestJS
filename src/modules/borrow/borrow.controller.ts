import { Controller, Post, Req, Param, Put, UseGuards } from '@nestjs/common';
import { BorrowService } from './borrow.service';
import { Request } from 'express';
import { PromiseGuard } from 'src/common/guard/promise.guard';

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
  @UseGuards(PromiseGuard)
  async approveBorrow(@Param('id') borrowId: number) {
    return this.borrowService.approveBorrow(borrowId);
  }
}
