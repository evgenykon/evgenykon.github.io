import type { Lang } from '../i18n/ui';

export function excerpt(markdown: string | undefined, max = 150): string {
  if (!markdown) return '';
  const text = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~|-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > 60 ? lastSpace : max).trim()}…`;
}

export function readingTime(markdown: string | undefined): number {
  if (!markdown) return 1;
  const words = markdown.replace(/[#>*_`~|-]/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

const MONTHS: Record<Lang, string[]> = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  ru: ['янв.', 'февр.', 'мар.', 'апр.', 'мая', 'июн.', 'июл.', 'авг.', 'сент.', 'окт.', 'нояб.', 'дек.'],
};

export function formatDate(date: Date, lang: Lang = 'en'): string {
  return `${date.getUTCDate()} ${MONTHS[lang][date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
