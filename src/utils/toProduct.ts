import type { Product, ProductDetailed } from '@/types';

export const toProduct = (item: ProductDetailed): Product => ({
  ...item,
  itemId: item.id,
  fullPrice: item.priceRegular,
  price: item.priceDiscount,
});
