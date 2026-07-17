import { defineCollection, z } from 'astro:content';

const musicCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    draft: z.boolean().default(false),
    embedUrl: z.string().url().optional(),
    seo: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      canonicalUrl: z.string().url().optional()
    }).optional()
  })
});

const techCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    featureImage: z.string().optional(),
    playStoreUrl: z.string().url().optional(),
    relatedMusic: z.array(z.string()).optional(),
    seo: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      canonicalUrl: z.string().url().optional()
    }).optional()
  })
});

const clioCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    draft: z.boolean().default(false),
    interviewee: z.string(),
    seo: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      canonicalUrl: z.string().url().optional()
    }).optional()
  })
});

export const collections = {
  'music': musicCollection,
  'tech': techCollection,
  'clio': clioCollection
};
