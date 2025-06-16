import { IsNotEmpty, IsEmail, IsEnum } from 'class-validator';
import { Gender, Role } from '../../../common/ultis/constants.ulti';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsEnum(Role)
  role: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  gender: string;

  @IsNotEmpty()
  birthDate: Date;
}
