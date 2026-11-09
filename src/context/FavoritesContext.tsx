import React, { createContext, useContext, useEffect, useState } from 'react';

import type { ReactNode } from 'react';

import type { Product } from '@/types';

type FavoritesContextType = {
  favorites: Product[];
  addToFavorites: (phone: Product) => void;
  removeFromFavorites: (id: string) => void;
  isInFavorites: (id: string) => boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

type Props = {
  children: ReactNode;
};

const LOCAL_STORAGE_KEY = 'favorites';

export const FavoritesProvider: React.FC<Props> = ({ children }) => {
  const [favorites, setFavorites] = useState<Product[]>(() => {
    try {
      const storedFavorites = localStorage.getItem(LOCAL_STORAGE_KEY);

      if (!storedFavorites) {
        return [];
      }

      const parsed: unknown = JSON.parse(storedFavorites);

      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (phone: Product) => {
    setFavorites(prevFavorites => {
      const alreadyExists = prevFavorites.some(item => item.id === phone.id);

      if (alreadyExists) {
        return prevFavorites;
      }

      return [...prevFavorites, phone];
    });
  };

  const removeFromFavorites = (id: string) => {
    setFavorites(prevFavorites =>
      prevFavorites.filter(phone => phone.id !== id),
    );
  };

  const isInFavorites = (id: string) => {
    return favorites.some(phone => phone.id === id);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isInFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);

  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }

  return context;
};
