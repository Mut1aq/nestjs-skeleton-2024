import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'resources/generated/i18n.generated';

export class FilterDto {
  @ApiProperty({
    description: 'number of objects to return',
    example: 15,
    isArray: false,
    name: 'take',
    required: true,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty'),
  })
  take!: number;

  @ApiProperty({
    description: 'number of objects to skip over, ',
    example: 0,
    isArray: false,
    name: 'take',
    required: true,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty'),
  })
  skip!: number;
}
