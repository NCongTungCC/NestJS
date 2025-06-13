import { IsEmail, IsNotEmpty, Length } from 'class-validator';

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
}
