import { useEffect, useState } from 'react';

import { useLoader } from '@/context/LoaderContext';

import type { Product, ProductDetailed } from '@/types';
import { toProduct } from '@/utils/toProduct';

export const useProducts = (productsData: ProductDetailed[]) => {
  const [products, setProducts] = useState<Product[]>([]);
  const { isLoading, setIsLoading } = useLoader();

  useEffect(() => {
    setIsLoading(true);

    const timeoutId = setTimeout(() => {
      const data = productsData.map(toProduct);

      setProducts(data);
      setIsLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [productsData, setIsLoading]);

  return {
    products,
    isLoading,
  };
};
