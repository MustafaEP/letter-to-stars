import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
const PASSWORD_MESSAGE =
  'Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir';

export class ChangePasswordDto {
  @IsString()
  @MinLength(8, { message: 'Eski şifre en az 8 karakter olmalıdır' })
  oldPassword: string;

  @IsString()
  @MinLength(8, { message: 'Yeni şifre en az 8 karakter olmalıdır' })
  @MaxLength(64, { message: 'Yeni şifre en fazla 64 karakter olabilir' })
  @Matches(PASSWORD_REGEX, { message: PASSWORD_MESSAGE })
  newPassword: string;
}