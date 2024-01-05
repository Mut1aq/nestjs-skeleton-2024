import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { IsContainsLowercase } from 'core/decorators/is-contains-lower-case.decorator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'resources/generated/i18n.generated';

export class LogUserInDto {
  @ApiProperty({
    description: "User's credentials, could be email or username",
    example: 'mut1aq',
    isArray: false,
    maxLength: 320,
    minLength: 3,
    name: 'credentials',
    required: true,
    type: String,
  })
  @MaxLength(320, {
    message: i18nValidationMessage<I18nTranslations>('validation.minLength', {
      max: 320,
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
  credentials!: string;

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
}
