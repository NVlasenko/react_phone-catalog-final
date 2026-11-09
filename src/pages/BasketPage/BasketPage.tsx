import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { BackButton } from '@/components/BackButton';
import { Modal } from '@/components/Modal';

import { useCart } from '@/context/CartContext';
import { useFooter } from '@/context/FooterContext';

import { EmptyPage } from '@/pages/EmptyPage';

import type { Product } from '@/types';

import './BasketPage.scss';

export const BasketPage: React.FC = () => {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const navigate = useNavigate();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const { setIsShow } = useFooter();

  const getItemPrice = (phone: Product) => {
    return phone.priceDiscount ?? phone.priceRegular ?? phone.price ?? 0;
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + getItemPrice(item.phone) * item.quantity,
      0,
    );
  };

  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const handleProductClick = (phone: Product) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    navigate(`/${phone.category}/${phone.id}`);
  };

  const handleCheckoutClick = () => {
    setIsModalVisible(true);
  };

  const handleConfirm = () => {
    clearCart();
    setIsModalVisible(false);
  };

  const handleClose = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    setIsShow(cartItems.length > 0);
  }, [cartItems.length, setIsShow]);

  return (
    <div className="basket container">
      <BackButton title="Basket" />

      <h2 className="basket__title">Basket</h2>

      <p className="basket__length">{totalQuantity} items</p>

      <div className="basket__content">
        <div className="basket__wrapper">
          {cartItems.length === 0 ? (
            <div className="basket__empty">
              <EmptyPage />
            </div>
          ) : (
            <>
              {cartItems.map(item => (
                <div
                  key={item.phone.id}
                  className="basket__itemGoods"
                  onClick={() => handleProductClick(item.phone)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="basket__remove">
                    <img
                      src={`${import.meta.env.BASE_URL}img/icons/closeMenu.svg`}
                      alt="remove"
                      className="basket__remove--icon"
                      onClick={event => {
                        event.stopPropagation();
                        removeItem(item.phone.id);
                      }}
                    />

                    <img
                      className="basket__imgGoods"
                      src={`${import.meta.env.BASE_URL}${item.phone.images?.[0]?.replace(/^\/+/, '') ?? ''}`}
                      alt={item.phone.name}
                    />

                    <p className="basket__nameGoods">{item.phone.name}</p>
                  </div>

                  <div className="basket__add">
                    <div className="basket__quantityGoods">
                      <p
                        className={`basket__quantityGoods--minus ${
                          item.quantity === 1
                            ? 'basket__quantityGoods--disabled'
                            : ''
                        }`}
                        onClick={event => {
                          event.stopPropagation();

                          if (item.quantity > 1) {
                            decreaseQuantity(item.phone.id);
                          }
                        }}
                      >
                        -
                      </p>

                      <p className="basket__countGoods">{item.quantity}</p>

                      <p
                        className="basket__quantityGoods--plus"
                        onClick={event => {
                          event.stopPropagation();
                          increaseQuantity(item.phone.id);
                        }}
                      >
                        +
                      </p>
                    </div>

                    <p className="basket__priceGoods">
                      ${getItemPrice(item.phone) * item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="total">
            <p className="total__ubtitle">${getTotalPrice()}</p>

            <p className="total__subtitle">Total for {totalQuantity} items</p>

            <hr className="total__hr" />

            <button className="total__button" onClick={handleCheckoutClick}>
              Checkout
            </button>
          </div>
        )}
      </div>

      <Modal
        isVisible={isModalVisible}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    </div>
  );
};
