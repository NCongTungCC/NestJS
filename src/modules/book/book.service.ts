import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { HttpStatus } from '@nestjs/common';
import { CreateBookDto } from './dto/CreateBookDto';
import { UpdateBookDto } from './dto/UpdateBookDto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book) private bookRepository: Repository<Book>,
  ) {}
  async createBook(payload: CreateBookDto) {
    const book = await this.bookRepository.findOne({
      where: { title: payload.title },
    });
    if (book) throw new ConflictException('Book already exists');
    const newBook = this.bookRepository.create(payload);
    await this.bookRepository.save(newBook);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Book created successfully',
      book: newBook,
    };
  }

  async checkBook(id: number) {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  async deleteBook(id: number) {
    const book = await this.checkBook(id);
    await this.bookRepository.remove(book);
    return {
      statusCode: HttpStatus.OK,
      message: 'Book deleted successfully',
      book,
    };
  }

  async updateBook(id: number, payload: UpdateBookDto) {
    const book = await this.checkBook(id);
    Object.assign(book, payload);
    await this.bookRepository.save(book);
    return {
      statusCode: HttpStatus.OK,
      message: 'Book updated successfully',
      book,
    };
  }

  async getBookById(id: number) {
    const book = await this.checkBook(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Book retrieved successfully',
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

    if (!books || books.length === 0)
      throw new NotFoundException('No books found');
    return {
      statusCode: HttpStatus.OK,
      message: 'Book retrieved successfully',
      book: books,
    };
  }
}
