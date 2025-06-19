import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Borrow } from './entities/borrow.entity';
import { Repository, DataSource } from 'typeorm';
import { Book } from '../book/entities/book.entity';

@Injectable()
export class BorrowService {
  constructor(
    @InjectRepository(Borrow) private borrowRepository: Repository<Borrow>,
    @InjectRepository(Book) private bookRepository: Repository<Book>,
    private dataSource: DataSource,
  ) {}

  async checkBook(bookId: number) {
    const book = await this.bookRepository.findOne({ where: { id: bookId } });
    if (!book) throw new NotFoundException('Book not found');
    if (book.availableBooks <= 0)
      throw new ConflictException('No available copies of the book');
    return book;
  }

  async borrowBook(userId: number, id: number) {
    const existingBorrow = await this.borrowRepository.findOne({
      where: { userId, bookId: id, status: 'unreturned' },
    });
    if (existingBorrow)
      throw new ConflictException('You have already borrowed this book');
    const book = await this.checkBook(id);
    const borrow = await this.borrowRepository.create({
      userId,
      bookId: id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    await this.dataSource.transaction(async (manager) => {
      book.availableBooks -= 1;
      await manager.getRepository(Book).save(book);

      await manager.getRepository(Borrow).save(borrow);
    });

    return {
      statusCode: 201,
      message: 'Book borrowed successfully',
      data: borrow,
    };
  }

  async returnBook(borrowId: number) {
    const borrow = await this.borrowRepository.findOne({
      where: { id: borrowId, status: 'unreturned' },
    });
    if (!borrow) throw new NotFoundException('Borrow record not found');
    borrow.status = 'pending';
    borrow.returnDate = new Date();
    await this.borrowRepository.save(borrow);
    return {
      statusCode: 200,
      message: 'Book returned successfully',
      data: borrow,
    };
  }

  async approveBorrow(borrowId: number) {
    const borrow = await this.borrowRepository.findOne({
      where: { id: borrowId, status: 'pending' },
    });
    if (!borrow) throw new NotFoundException('Borrow record not found');
    const book = await this.checkBook(borrow.bookId);
    borrow.status = 'returned';
    await this.dataSource.transaction(async (manager) => {
      book.availableBooks += 1;
      await manager.getRepository(Book).save(book);

      await manager.getRepository(Borrow).save(borrow);
    });
    return {
      statusCode: 200,
      message: 'Borrow returned successfully',
      data: borrow,
    };
  }
}
