import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    type: z.string().optional(),
    title: z.string(),
    date: z.coerce.date(),
    img: z.string().nullable().optional(),
  }),
});

const skill = z.object({ name: z.string(), rate: z.number() });
const job = z.object({
  title: z.string(),
  role: z.string(),
  place: z.string().optional(),
  period: z.string(),
  description: z.string().optional(),
  stack: z.array(z.string()).optional(),
});

const cv = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cv' }),
  schema: z.object({
    type: z.string().optional(),
    title: z.string(),
    position: z.string(),
    annotation: z.string(),
    age: z.number().optional(),
    location: z.string().optional(),
    email: z.string().optional(),
    pdf: z.string().optional(),
    baseUrl: z.string().optional(),
    skills: z.array(skill).default([]),
    socialLinks: z
      .array(z.object({ id: z.string(), url: z.string(), img: z.string().optional(), print: z.string().optional() }))
      .default([]),
    education: z.object({
      name: z.string(),
      place: z.string().optional(),
      degree: z.string().optional(),
      dates: z.string().optional(),
    }).optional(),
    achivements: z
      .array(z.object({ name: z.string(), date: z.string().optional(), url: z.string().optional() }))
      .default([]),
    jobs: z.array(job).default([]),
  }),
});

export const collections = { blog, cv };
