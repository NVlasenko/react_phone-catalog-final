import React from 'react';
import { Link } from 'react-router-dom';

import './Footer.scss';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="footer container">
      <div className="footer__container">
        <Link to="/" className="footer__logo">
          <img
            src={`${import.meta.env.BASE_URL}img/icons/logo2.svg`}
            alt="Logo"
          />
        </Link>

        <div className="footer__info">
          <a
            href="https://github.com/NVlasenko"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="footer__text">Github</p>
          </a>

          <a href="mailto:vlasenkonadia@gmail.com">
            <p className="footer__text">Contacts</p>
          </a>

          <a
            href={
              'https://github.com/NVlasenko/' +
              'react_phone-catalog-final/blob/main/LICENSE'
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="footer__text">Rights</p>
          </a>
        </div>

        <div className="footer__top">
          <p onClick={scrollToTop} className="footer__back">
            Back to top
          </p>
          <span onClick={scrollToTop}></span>
        </div>
      </div>
    </div>
  );
};
