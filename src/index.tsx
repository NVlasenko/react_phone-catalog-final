import { createRoot } from 'react-dom/client';

import { Root } from '@/Root';

import { CartProvider } from '@/context/CartContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { FooterProvider } from '@/context/FooterContext';
import { LoaderProvider } from '@/context/LoaderContext';
import { ProductCategoryProvider } from '@/context/ProductCategoryProvider';
import { ProductsProvider } from '@/context/ProductContexts';
import { ThemeProvider } from '@/context/ThemeProvider';

createRoot(document.getElementById('root') as HTMLElement).render(
  <ThemeProvider>
    <FavoritesProvider>
      <ProductsProvider>
        <CartProvider>
          <ProductCategoryProvider>
            <LoaderProvider>
              <FooterProvider>
                <Root />
              </FooterProvider>
            </LoaderProvider>
          </ProductCategoryProvider>
        </CartProvider>
      </ProductsProvider>
    </FavoritesProvider>
  </ThemeProvider>,
);
