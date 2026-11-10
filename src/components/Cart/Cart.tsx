import React from 'react';
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

  const navigate = useNavigate();

  const isAdded = isInCart(product.id);
  const isLiked = isInFavorites(product.id);

  const handleAddToCart = () => {
    if (isAdded) {
      removeItem(product.id);
    } else {
      addToCart(product);
    }
  };

  const handleToggleFavorite = () => {
    if (isLiked) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites({
        ...product,
        showDiscount,
      });
    }
  };

  const handleImageClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    navigate(`/${product.category}/${product.id}`);
  };

  const imagePath = product.images?.[0];

  const imageSrc = imagePath
    ? `${import.meta.env.BASE_URL}${imagePath.replace(/^\/+/, '')}`
    : '';

  return (
    <div className="cart" onClick={handleImageClick}>
      <div className="cart__context">
        <div className="cart__wrapper">
          <img className="cart__image" src={imageSrc} alt={product.name} />

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
