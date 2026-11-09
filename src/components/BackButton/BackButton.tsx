import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './BackButton.scss';

type BackButtonProps = {
  title: string;
  isFullDetailsOfProduct?: boolean;
  nameProduct?: string;
};

export const BackButton: React.FC<BackButtonProps> = ({
  title,
  isFullDetailsOfProduct,
  nameProduct,
}) => {
  const navigate = useNavigate();

  const categoryPath =
    title.toLowerCase() === 'tablets'
      ? '/tablets'
      : title.toLowerCase() === 'accessories'
        ? '/accessories'
        : '/phones';

  const handleBack = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.history.state?.idx > 0) {
      event.preventDefault();
      navigate(-1);
    }
  };

  return (
    <>
      <div className="back">
        <Link to="/">
          <img
            className="back__home"
            src={`${import.meta.env.BASE_URL}img/icons/backHome.svg`}
            alt="back home"
          />
        </Link>

        <img
          className="back__arrow"
          src={`${import.meta.env.BASE_URL}img/icons/backHomeArrow.svg`}
          alt="arrow home"
        />

        <Link to={categoryPath} className="back__title">
          {title}
        </Link>

        {isFullDetailsOfProduct && (
          <>
            <img
              className="back__arrow"
              src={`${import.meta.env.BASE_URL}img/icons/backHomeArrow.svg`}
              alt="arrow home"
            />

            <p className="back__title">{nameProduct}</p>
          </>
        )}
      </div>

      {isFullDetailsOfProduct && (
        <Link to={categoryPath} onClick={handleBack} className="back__add">
          <img
            className="back__arrow back__arrow--left"
            src={`${import.meta.env.BASE_URL}img/icons/backHomeArrow.svg`}
            alt="arrow home"
          />

          <p className="back__title">Back</p>
        </Link>
      )}
    </>
  );
};
