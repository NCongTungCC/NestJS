import { IsEmail, IsEnum, IsNotEmpty, Length } from 'class-validator';
import { Gender } from 'src/common/ultis/constants.ulti';

export class SignUpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @Length(6, 20, {
    message: 'Password must be between 6 and 20 characters',
  })
  password: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  gender: string;

  @IsNotEmpty()
  birthDate: Date;
}
