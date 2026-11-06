import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CartControls } from '@/components/CartControls';
import { PhoneSpecs } from '@/components/PhoneSpecs';
import { PriceDisplay } from '@/components/PriceDisplay';

import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';

import type { Product } from '@/types';

import './Cart.scss';

type Props = {
  product: Product;
  showDiscount?: boolean;
};

export const Cart: React.FC<Props> = ({ product, showDiscount = true }) => {
  const { addToCart, removeItem, isInCart } = useCart();
  const { addToFavorites, removeFromFavorites, isInFavorites } = useFavorites();
  const [isAdded, setIsAdded] = useState(isInCart(product.id));
  const [isLiked, setIsLiked] = useState(isInFavorites(product.id));
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (isAdded) {
      removeItem(product.id);
    } else {
      addToCart(product);
    }

    setIsAdded(!isAdded);
  };

  const handleToggleFavorite = () => {
    if (isLiked) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }

    setIsLiked(!isLiked);
  };

  useEffect(() => {
    setIsAdded(isInCart(product.id));
  }, [isInCart, product.id]);

  useEffect(() => {
    setIsLiked(isInFavorites(product.id));
  }, [isInFavorites, product.id]);

  const handleImageClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`/${product.category}/${product.id}`);
  };

  return (
    <div className="cart">
      <div className="cart__context">
        <div className="cart__wrapper">
          <img
            className="cart__image"
            src={`/${product.images[0].replace(/^\/+/, '')}`}
            alt={product.name}
            onClick={handleImageClick}
          />

          <p className="cart__name">{product.name}</p>
          <PriceDisplay
            priceRegular={product.priceRegular}
            priceDiscount={product.priceDiscount}
            showDiscount={showDiscount}
          />
          <hr />
          <PhoneSpecs
            screen={product.screen}
            capacity={product.capacity}
            ram={product.ram}
            color={product.color}
          />
          <CartControls
            isAdded={isAdded}
            isLiked={isLiked}
            onAddToCart={handleAddToCart}
            onToggleFavorite={handleToggleFavorite}
          />
        </div>
      </div>
    </div>
  );
};
