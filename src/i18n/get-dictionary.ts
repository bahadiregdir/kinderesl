import { en, Dictionary } from './dictionaries/en';
import { tr } from './dictionaries/tr';

export function getDictionary(locale: string = 'en'): Dictionary {
  if (locale === 'tr') {
    return tr;
  }
  return en;
}
