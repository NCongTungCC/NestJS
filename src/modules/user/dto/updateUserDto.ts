import { IsEmpty, IsEnum, IsOptional } from 'class-validator';
import { Gender, Role } from 'src/common/ultis/constants.ulti';

export class UpdateUserDto {
  name?: string;

  @IsEmpty()
  password?: string;
  email?: string;

  @IsEnum(Gender)
  @IsOptional()
  gender?: string;

  @IsEnum(Role)
  @IsOptional()
  role?: string;

  birthDate?: Date;
}
