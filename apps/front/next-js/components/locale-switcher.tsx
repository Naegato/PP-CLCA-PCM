import { LocaleSwitcherSelect } from '@/components/locale-switcher-select';
import {useLocale, useTranslations} from 'next-intl';
import {routing} from '@/src/i18n/routing';

export function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const locale = useLocale();

  return (
    <LocaleSwitcherSelect defaultValue={locale} label={t('label')}>
      {routing.locales.map((cur) => (
        <option key={cur} value={cur}>
          {t(cur)}
        </option>
      ))}
    </LocaleSwitcherSelect>
  );
}