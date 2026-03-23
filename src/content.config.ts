import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const stepSchema = z.object({
  headline: z.string().optional(),
  body: z.string(),
  publicId: z.string(),
  alt: z.string(),
  credit: z.string().optional(),
  crop: z.enum(['fill', 'thumb', 'crop', 'auto', 'limit', 'scale']).default('fill'),
  gravity: z.string().default('auto'),
  aspect: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  namedTransform: z.string().optional(),
  focusX: z.number().min(0).max(100).default(50),
  focusY: z.number().min(0).max(100).default(50),
  zoom: z.number().min(1).default(1),
});

const closeReads = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/data/close-reads' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    heroPublicId: z.string(),
    heroAlt: z.string(),
    heroCredit: z.string().optional(),
    heroCreditUrl: z.string().url().optional(),
    heroZoom: z.number().min(1).default(1),
    heroFocusX: z.number().min(0).max(100).default(50),
    heroFocusY: z.number().min(0).max(100).default(50),
    heroDuration: z.number().min(0).default(8),
    steps: z.array(stepSchema).min(1),
  }),
});

export const collections = { 'close-reads': closeReads };
