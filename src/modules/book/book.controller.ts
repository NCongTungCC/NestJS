import { Controller, Delete, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { Post, Body, Get, Query, Put, Param } from '@nestjs/common';
import { CreateBookDto } from './dto/CreateBookDto';
import { ALLOWED_BOOK, LIMIT, PAGE } from 'src/common/ultis/constants.ulti';
import { PromiseGuard } from 'src/common/guard/promise.guard';
import { UpdateBookDto } from './dto/UpdateBookDto';

@Controller({
  path: 'books',
  version: '1',
})
export class BookController {
  constructor(private readonly bookService: BookService) {}
  @Get()
  async getBook(@Query() filter: any) {
    const limit = filter.limit || LIMIT;
    const page = filter.page || PAGE;
    const offset = (page - 1) * limit;
    const query = Object.fromEntries(
      Object.entries(filter).filter(
        ([key, value]) => ALLOWED_BOOK.includes(key) && value !== undefined,
      ),
    );
    return this.bookService.getBook(query, limit, offset);
  }

  @Get(':id')
  async getBookById(@Param('id') id: number) {
    return this.bookService.getBookById(id);
  }

  @Post()
  @UseGuards(PromiseGuard)
  async createBook(@Body() createBookDto: CreateBookDto) {
    return this.bookService.createBook(createBookDto);
  }

  @Put(':id')
  @UseGuards(PromiseGuard)
  async updateBook(
    @Param('id') id: number,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return this.bookService.updateBook(id, updateBookDto);
  }

  @Delete(':id')
  @UseGuards(PromiseGuard)
  async deleteBook(@Param('id') id: number) {
    return this.bookService.deleteBook(id);
  }
}
