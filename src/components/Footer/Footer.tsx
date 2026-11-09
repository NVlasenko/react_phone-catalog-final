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
          <Link to="https://github.com/NVlasenko">
            <p className="footer__text">Github</p>
          </Link>

          <Link to="/not-found">
            <p className="footer__text">Contacts</p>
          </Link>

          <Link to="/not-found">
            <p className="footer__text">rights</p>
          </Link>
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
