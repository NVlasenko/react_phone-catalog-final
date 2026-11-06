import React, { createContext, useContext, useState } from 'react';

type ProductCategory = 'phones' | 'accessories' | 'tablets';

type ProductCategoryContextType = {
  productType: ProductCategory;
  setProductType: (type: ProductCategory) => void;
};

type ProductCategoryContextValue = ProductCategoryContextType | undefined;

const ProductCategoryContext =
  createContext<ProductCategoryContextValue>(undefined);

export const ProductCategoryProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [productType, setProductType] = useState<ProductCategory>('phones');

  return (
    <ProductCategoryContext.Provider value={{ productType, setProductType }}>
      {children}
    </ProductCategoryContext.Provider>
  );
};

export const useProductCategoryContext = () => {
  const context = useContext(ProductCategoryContext);

  if (!context) {
    throw new Error(
      'useProductCategoryContext must be used within a ProductCategoryProvider',
    );
  }

  return context;
};
