export const languages = {
  en: 'English',
  ru: 'Русский',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'en';

export const ui = {
  en: {
    htmlLang: 'en',
    brand: 'evgeny.kon',
    navBlog: 'Blog',
    navProjects: 'Pet Projects',
    navCv: 'CV',
    navGithub: 'GitHub',
    switchTo: 'Русский',
    switchHref: '/ru/',
    title: 'DevBlog',
    description: 'Engineering notes, pet projects and CV.',
    minRead: 'min read',
    backToTop: 'back to top ↑',
    cveyebrow: 'CV · 3 angles',
    cvTitle: 'Same person, three focus points',
    cvLead: 'Full-stack lead, frontend architect and backend engineer — pick the one that matches the role.',
    openCv: 'Open CV →',
    elsewhere: 'Elsewhere',
    builtWith: 'built with Astro',
    postOf: 'of',
    intro: [
      'Every repo here started as a 3 a.m. idea — and survived the morning.',
      "While you're reading this, another one is already on its way to main.",
      'Physics, maths, culture: I go after the questions nobody has answered yet.',
      'The plan is simple — build tools that help someone make a real discovery. Or just have fun doing it.',
    ],
    bottom: 'Right now I just want to have my personal page to share my CV and my ideas.',
  },
  ru: {
    htmlLang: 'ru',
    brand: 'evgeny.kon',
    navBlog: 'Блог',
    navProjects: 'Пет-проекты',
    navCv: 'Резюме',
    navGithub: 'GitHub',
    switchTo: 'English',
    switchHref: '/',
    title: 'ДевБлог',
    description: 'Инженерные заметки, пет-проекты и резюме.',
    minRead: 'мин чтения',
    backToTop: 'наверх ↑',
    cvEyebrow: 'Резюме · 3 версии',
    cvTitle: 'Один человек, три фокуса',
    cvLead: 'Фулстек-лид, фронтенд-архитектор и бэкенд-инженер — выбирайте ту, что подходит под роль.',
    openCv: 'Открыть резюме →',
    elsewhere: 'Ссылки',
    builtWith: 'сделано на Astro',
    postOf: 'из',
    intro: [
      'Каждый репозиторий здесь начался как идея в три часа ночи — и пережил утро.',
      'Пока вы это читаете, следующий уже едет в main.',
      'Физика, математика, культура: я берусь за вопросы, на которые ещё никто не ответил.',
      'План простой — делать инструменты, которые помогают кому-то совершить настоящее открытие. Или просто весело.',
    ],
    bottom: 'Сейчас мне просто хочется иметь личную страницу, чтобы делиться резюме и идеями.',
  },
} as const;

export function t(lang: Lang) {
  return ui[lang];
}
