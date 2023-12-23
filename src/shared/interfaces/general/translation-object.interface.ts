import { PathImpl2 } from '@nestjs/config';
import { I18nTranslations } from 'resources/generated/i18n.generated';

export interface TranslationObjectI {
  translationKey: PathImpl2<I18nTranslations>;
  args?: { [key: string]: PathImpl2<I18nTranslations> };
}
