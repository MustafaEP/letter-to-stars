import { IsString, MinLength, MaxLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @MinLength(8, { message: 'Eski şifre en az 8 karakter olmalıdır' })
  oldPassword: string;

  @IsString()
  @MinLength(8, { message: 'Yeni şifre en az 8 karakter olmalıdır' })
  @MaxLength(64)
  newPassword: string;
}