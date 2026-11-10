import React from 'react';

import './CartControls.scss';

type Props = {
  isAdded: boolean;
  isLiked: boolean;
  onAddToCart: () => void;
  onToggleFavorite: () => void;
};

export const CartControls: React.FC<Props> = ({
  isAdded,
  isLiked,
  onAddToCart,
  onToggleFavorite,
}) => {
  return (
    <div className="cart__added">
      <button
        className={`cart__added--add ${isAdded ? 'cart__added--isAdded' : ''}`}
        onClick={event => {
          event.stopPropagation();
          onAddToCart();
        }}
      >
        {isAdded ? 'Added' : 'Add to cart'}
      </button>

      <button
        className={`cart__added--heart ${isLiked ? 'liked' : ''}`}
        onClick={event => {
          event.stopPropagation();
          onToggleFavorite();
        }}
        aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}
      />
    </div>
  );
};
