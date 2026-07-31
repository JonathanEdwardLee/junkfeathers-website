import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const music = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/music" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    draft: z.boolean().default(false),
    internalFixture: z.boolean().default(false),
    embedUrl: z.url().optional(),
    seo: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      canonicalUrl: z.url().optional()
    }).optional()
  })
});

const tech = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/tech" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    draft: z.boolean().default(false),
    internalFixture: z.boolean().default(false),
    featured: z.boolean().default(false),
    featureImage: z.string().optional(),
    playStoreUrl: z.url().optional(),
    relatedMusic: z.array(z.string()).optional(),
    seo: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      canonicalUrl: z.url().optional()
    }).optional()
  })
});

const clio = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/clio" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    draft: z.boolean().default(false),
    internalFixture: z.boolean().default(false),
    interviewee: z.string(),
    seo: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      canonicalUrl: z.url().optional()
    }).optional()
  })
});

export const collections = { music, tech, clio };
