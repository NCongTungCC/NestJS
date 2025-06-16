import { IsOptional, IsString, IsInt } from 'class-validator';

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  year?: number;

  @IsOptional()
  @IsInt()
  totalBooks?: number;

  @IsOptional()
  @IsInt()
  availableBooks?: number;

  @IsOptional()
  @IsString()
  category?: string;
}
