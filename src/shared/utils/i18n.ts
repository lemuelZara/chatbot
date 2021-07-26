import { I18n } from 'i18n';
import path from 'path';

const i18n = new I18n();

i18n.configure({
  locales: ['en_US', 'pt_BR'],
  defaultLocale: 'pt_BR',
  directory: path.join('./locales'),
  objectNotation: true,
  api: {
    __: 'translate',
    __n: 'translateN'
  }
});

export { i18n };
