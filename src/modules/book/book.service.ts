import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { HttpStatus } from '@nestjs/common';
import { CreateBookDto } from './dto/CreateBookDto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book) private bookRepository: Repository<Book>,
  ) {}
  async createBook(payload: CreateBookDto) {
    const book = await this.bookRepository.findOne({
      where: { title: payload.title },
    });
    if (book) {
      return {
        code: HttpStatus.CONFLICT,
        message: 'Book already exists',
      };
    }
    const newBook = this.bookRepository.create(payload);
    await this.bookRepository.save(newBook);
    return {
      code: HttpStatus.CREATED,
      message: 'Book created successfully',
      book: newBook,
    };
  }

  async deleteBook(id: number) {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      return {
        code: HttpStatus.NOT_FOUND,
        message: 'Book not found',
      };
    }
    await this.bookRepository.remove(book);
    return {
      code: HttpStatus.OK,
      message: 'Book deleted successfully',
      book,
    };
  }

  async updateBook(id: number, payload: CreateBookDto) {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      return {
        code: HttpStatus.NOT_FOUND,
        message: 'Book not found',
      };
    }
    Object.assign(book, payload);
    await this.bookRepository.save(book);
    return {
      code: HttpStatus.OK,
      message: 'Book updated successfully',
      book,
    };
  }

  async getBook(filter: any, limit, offset) {
    const query = this.bookRepository
      .createQueryBuilder('book')
      .take(limit)
      .skip(offset)
      .orderBy('book.id', 'DESC');

    Object.entries(filter).forEach(([key, value]) => {
      query.andWhere(`book.${key} LIKE :${key}`, { [key]: `%${value}%` });
    });

    const books = await query.getMany();

    if (!books || books.length === 0) {
      return {
        code: HttpStatus.NOT_FOUND,
        message: 'Book not found',
      };
    }
    return {
      code: HttpStatus.OK,
      message: 'Book retrieved successfully',
      book: books,
    };
  }
}
