import { Controller, Delete, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { Post, Body, Res, Get, Query, Put, Param } from '@nestjs/common';
import { CreateBookDto } from './dto/CreateBookDto';
import { Response } from 'express';
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
  async getBook(@Res() res: Response, @Query() filter: any) {
    const limit = filter?.limit || LIMIT;
    const page = filter?.page || PAGE;
    const offset = (page - 1) * limit;
    const query = Object.fromEntries(
      Object.entries(filter).filter(
        ([key, value]) => ALLOWED_BOOK.includes(key) && value !== undefined,
      ),
    );
    const result = await this.bookService.getBook(query, limit, offset);
    return res.status(result.code).json(result);
  }

  @Get(':id')
  async getBookById(@Res() res: Response, @Param('id') id: number) {
    const result = await this.bookService.getBookById(id);
    return res.status(result.code).json(result);
  }

  @Post()
  @UseGuards(PromiseGuard)
  async createBook(@Body() createBookDto: CreateBookDto, @Res() res: Response) {
    const result = await this.bookService.createBook(createBookDto);
    return res.status(result.code).json(result);
  }

  @Put(':id')
  @UseGuards(PromiseGuard)
  async updateBook(
    @Res() res: Response,
    @Param('id') id: number,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    const result = await this.bookService.updateBook(id, updateBookDto);
    return res.status(result.code).json(result);
  }

  @Delete(':id')
  @UseGuards(PromiseGuard)
  async deleteBook(@Res() res: Response, @Param('id') id: number) {
    const result = await this.bookService.deleteBook(id);
    return res.status(result.code).json(result);
  }
}
