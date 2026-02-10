import { IsString, IsInt, Min, Max, MinLength, MaxLength } from 'class-validator';

export class CreateDiaryDto {
  @IsString({ message: 'Metin gereklidir' })
  @MinLength(10, { message: 'Metin en az 10 karakter olmalıdır' })
  @MaxLength(10000, { message: 'Metin en fazla 5000 karakter olabilir' })
  originalText: string;

  @IsInt({ message: 'IELTS seviyesi tam sayı olmalıdır' })
  @Min(6, { message: 'IELTS seviyesi en az 6 olmalıdır' })
  @Max(9, { message: 'IELTS seviyesi en fazla 9 olabilir' })
  ieltsLevel: number;
}