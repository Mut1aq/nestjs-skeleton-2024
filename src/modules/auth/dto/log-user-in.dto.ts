import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LogUserInDto {
  @MaxLength(320)
  @MinLength(5)
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email!: string;

  @MaxLength(30)
  @MinLength(8)
  @IsString()
  @IsNotEmpty()
  password!: string;
}
