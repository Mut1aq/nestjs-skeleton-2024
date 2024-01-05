import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { IsEmail, IsString } from 'class-validator';
import { MaxLength, MinLength, IsNotEmpty } from 'class-validator';
import { IsContainsLowercase } from 'core/decorators/is-contains-lower-case.decorator';
import { MatchTwoProperties } from 'core/decorators/match-two-properties.decorator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'resources/generated/i18n.generated';

export class CreateUserDto {
  @ApiProperty({
    description: "User's username",
    example: 'mut1aq',
    isArray: false,
    maxLength: 30,
    minLength: 3,
    name: 'username',
    required: true,
    type: String,
  })
  @MaxLength(30, {
    message: i18nValidationMessage<I18nTranslations>('validation.minLength', {
      max: 30,
    }),
  })
  @MinLength(3, {
    message: i18nValidationMessage<I18nTranslations>('validation.minLength', {
      min: 3,
    }),
  })
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.isString'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty'),
  })
  username!: string;

  @ApiProperty({
    description: "User's email",
    example: 'mut1aq@gmail.com',
    isArray: false,
    maxLength: 320,
    minLength: 5,
    name: 'email',
    required: true,
    type: String,
  })
  @MaxLength(320, {
    message: i18nValidationMessage<I18nTranslations>('validation.minLength', {
      max: 320,
    }),
  })
  @MinLength(5, {
    message: i18nValidationMessage<I18nTranslations>('validation.minLength', {
      min: 5,
    }),
  })
  @IsEmail(undefined, {
    message: i18nValidationMessage<I18nTranslations>('validation.email'),
  })
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.isString'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty'),
  })
  email!: string;

  @ApiProperty({
    description: "User's password",
    example: 'mut1aq.54321',
    isArray: false,
    maxLength: 30,
    minLength: 8,
    name: 'password',
    required: true,
    type: String,
  })
  @MaxLength(30, {
    message: i18nValidationMessage<I18nTranslations>('validation.minLength', {
      max: 30,
    }),
  })
  @MinLength(8, {
    message: i18nValidationMessage<I18nTranslations>('validation.minLength', {
      min: 8,
    }),
  })
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.isString'),
  })
  @IsContainsLowercase({
    message: i18nValidationMessage<I18nTranslations>(
      'validation.passwordContains.lowercase',
    ),
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty'),
  })
  password!: string;

  @ApiProperty({
    description: "User's confirm password",
    example: 'mut1aq.54321',
    isArray: false,
    maxLength: 30,
    minLength: 8,
    name: 'confirmPassword',
    required: true,
    type: String,
  })
  @MatchTwoProperties('password')
  confirmPassword!: string;
}
