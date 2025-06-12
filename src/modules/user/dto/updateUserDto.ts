import { IsEmpty } from 'class-validator';

export class updateUserDto {
  name: string;

  @IsEmpty()
  password: string;

  email: string;
}
