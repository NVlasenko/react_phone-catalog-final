import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';

import { App } from '@/App';

import { NotFound } from '@/components/NotFound';

import { AccessoriesPage } from '@/pages/AccessoriesPage';
import { BasketPage } from '@/pages/BasketPage';
import { FavoritesPage } from '@/pages/FavoritesPage';
import { HomePage } from '@/pages/HomePage';
import { PhonesPage } from '@/pages/PhonesPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage/ProductDetailPage';
import { TabletsPage } from '@/pages/TabletsPage';

export const Root: React.FC = () => (
  <Router
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}
  >
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<HomePage />} />
        <Route path="phones">
          <Route index element={<PhonesPage />} />
          <Route path=":productId" element={<ProductDetailPage />} />
        </Route>
        <Route path="tablets">
          <Route index element={<TabletsPage />} />
          <Route path=":productId" element={<ProductDetailPage />} />
        </Route>
        <Route path="accessories">
          <Route index element={<AccessoriesPage />} />
          <Route path=":productId" element={<ProductDetailPage />} />
        </Route>
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="basket" element={<BasketPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </Router>
);
