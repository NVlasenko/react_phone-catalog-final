import type { Product } from '@/types';

export type SortType = 'newest' | 'latest';

const extractVersionNumber = (name: string): number => {
  const match = name.match(/\d+/);

  return match ? parseInt(match[0], 10) : 0;
};

export const sortProducts = (
  products: Product[],
  sortType: SortType,
): Product[] => {
  return [...products].sort((a, b) => {
    const versionA = extractVersionNumber(a.name);
    const versionB = extractVersionNumber(b.name);

    return sortType === 'latest' ? versionA - versionB : versionB - versionA;
  });
};
