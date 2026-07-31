import { getCollection, type CollectionKey, type CollectionEntry } from 'astro:content';

/**
 * Returns only published collection entries, strictly excluding drafts and internal schema fixtures.
 */
export async function getPublishedEntries<K extends CollectionKey>(
  collection: K
): Promise<CollectionEntry<K>[]> {
  return await getCollection(collection, (entry) => {
    const data = entry.data as { draft?: boolean; internalFixture?: boolean };
    return data.draft !== true && data.internalFixture !== true;
  });
}
