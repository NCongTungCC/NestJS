import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BorrowService } from './borrow.service';
import { BorrowController } from './borrow.controller';
import { Borrow } from './entities/borrow.entity';
import { Book } from '../book/entities/book.entity';
import { SetupDueBookService } from './setupDueBook.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Borrow]),
    TypeOrmModule.forFeature([Book]),
  ],
  controllers: [BorrowController],
  providers: [BorrowService, SetupDueBookService],
})
export class BorrowModule {}
