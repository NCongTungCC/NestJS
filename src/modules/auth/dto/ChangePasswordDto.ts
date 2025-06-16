import { IsNotEmpty, Length } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

export class ChangePasswordDto {
  @IsNotEmpty()
  oldPassword: string;

  @IsNotEmpty()
  @Length(6, 20, {
    message: 'New password must be between 6 and 20 characters',
  })
  newPassword: string;

  @IsNotEmpty()
  @Length(6, 20, {
    message: 'Confirm password must be between 6 and 20 characters',
  })
  confirmNewPassword: string;
}
