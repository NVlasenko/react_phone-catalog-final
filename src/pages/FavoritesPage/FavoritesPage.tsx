import React, { useEffect } from 'react';

import { BackButton } from '@/components/BackButton';
import { Cart } from '@/components/Cart';

import { useFavorites } from '@/context/FavoritesContext';
import { useFooter } from '@/context/FooterContext';

import { EmptyPage } from '@/pages/EmptyPage';

import './FavoritesPage.scss';

export const FavoritesPage: React.FC = () => {
  const { favorites } = useFavorites();
  const { setIsShow } = useFooter();

  useEffect(() => {
    setIsShow(favorites.length > 0);
  }, [favorites.length, setIsShow]);

  return (
    <div className="favorites container">
      <BackButton title="Favorites" />
      <h2 className="favorites__title">Favorites</h2>
      <p className="favorites__length">{favorites.length} items</p>
      <div className="favorites__wrapper">
        {favorites.length > 0 ? (
          favorites.map(product => (
            <Cart key={product.id} product={product} showDiscount={true} />
          ))
        ) : (
          <EmptyPage />
        )}
      </div>
    </div>
  );
};
