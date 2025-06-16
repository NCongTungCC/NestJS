import { IsNotEmpty } from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  author: string;

  @IsNotEmpty()
  discripton: string;

  @IsNotEmpty()
  year: number;

  @IsNotEmpty()
  totalBooks: number;

  @IsNotEmpty()
  availableBooks: number;

  @IsNotEmpty()
  category: string;
}
