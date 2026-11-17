import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';

export type BlogEntry = CollectionEntry<'blog'>;

/** Posts for a language, newest first. RU falls back to EN when a translation is missing. */
export async function getPosts(lang: Lang): Promise<BlogEntry[]> {
  const source = lang === 'ru' ? await getCollection('blogRu') : await getCollection('blog');
  return source.sort((a, b) => b.data.date.getTime() - a.data.date.getTime()) as unknown as BlogEntry[];
}

export function postAnchor(id: string): string {
  return `post-${id}`;
}
