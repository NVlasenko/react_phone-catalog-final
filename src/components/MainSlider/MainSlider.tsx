import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import './MainSlider.scss';

const baseUrl = import.meta.env.BASE_URL;

const slides = [
  {
    id: 1,
    title: 'iPhone 18 Pro Max',
    subtitle: 'The next level of innovation.',
    image: `${baseUrl}img/banners/iphone_burgundy.png`,
    link: '/phones',
    accent: 'burgundy',
  },
  {
    id: 2,
    title: 'Premium Collection',
    subtitle: 'Elegance in every detail.',
    image: `${baseUrl}img/banners/iphone_gold.png`,
    link: '/phones',
    accent: 'gold',
  },
  {
    id: 3,
    title: 'iPhone Pro',
    subtitle: 'Power meets style.',
    image: `${baseUrl}img/banners/iphone_black.png`,
    link: '/phones',
    accent: 'purple',
  },
];

const extendedSlides = [slides[slides.length - 1], ...slides, slides[0]];

export const MainSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const touchStartX = useRef<number | null>(null);
  const isAnimating = useRef(false);

  const handleNext = useCallback(() => {
    if (isAnimating.current) {
      return;
    }

    isAnimating.current = true;
    setIsTransitioning(true);
    setCurrentIndex(index => index + 1);
  }, []);

  const handlePrevious = useCallback(() => {
    if (isAnimating.current) {
      return;
    }

    isAnimating.current = true;
    setIsTransitioning(true);
    setCurrentIndex(index => index - 1);
  }, []);

  const handleTransitionEnd = (
    event: React.TransitionEvent<HTMLDivElement>,
  ) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    if (event.propertyName !== 'transform') {
      return;
    }

    if (currentIndex === slides.length + 1) {
      setIsTransitioning(false);
      setCurrentIndex(1);
    } else if (currentIndex === 0) {
      setIsTransitioning(false);
      setCurrentIndex(slides.length);
    }

    isAnimating.current = false;
  };

  useEffect(() => {
    const interval = window.setInterval(handleNext, 5000);

    return () => window.clearInterval(interval);
  }, [handleNext]);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) {
      return;
    }

    const difference = touchStartX.current - event.changedTouches[0].clientX;

    if (Math.abs(difference) > 50) {
      if (difference > 0) {
        handleNext();
      } else {
        handlePrevious();
      }
    }

    touchStartX.current = null;
  };

  const handleDotClick = (index: number) => {
    if (isAnimating.current) {
      return;
    }

    const targetIndex = index + 1;

    if (targetIndex === currentIndex) {
      return;
    }

    isAnimating.current = true;
    setIsTransitioning(true);
    setCurrentIndex(targetIndex);
  };

  const activeIndex = (currentIndex - 1 + slides.length) % slides.length;

  return (
    <div className="mainSlider">
      <div className="mainSlider__wrapper">
        <button
          type="button"
          className="mainSlider__arrow"
          onClick={handlePrevious}
          aria-label="Previous slide"
        >
          <img src={`${baseUrl}img/icons/SliderButtonLeft.png`} alt="" />
        </button>

        <div
          className="mainSlider__viewport"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="mainSlider__track"
            onTransitionEnd={handleTransitionEnd}
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
              transition: isTransitioning
                ? 'transform 0.5s ease-in-out'
                : 'none',
            }}
          >
            {extendedSlides.map((slide, index) => (
              <div
                className={`mainSlider__banner mainSlider__banner--${slide.accent}`}
                key={`${slide.id}-${index}`}
              >
                <div className="mainSlider__content">
                  <div>
                    <h2 className="mainSlider__heading">
                      Now available
                      <br />
                      in our store! 👌
                    </h2>

                    <p className="mainSlider__description">Be the first!</p>
                  </div>

                  <Link to={slide.link} className="mainSlider__order">
                    ORDER NOW
                  </Link>
                </div>

                <div className="mainSlider__product">
                  <div className="mainSlider__productText">
                    <h3 className="mainSlider__productTitle">{slide.title}</h3>

                    <p className="mainSlider__productSubtitle">
                      {slide.subtitle}
                    </p>
                  </div>

                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="mainSlider__phone"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="mainSlider__arrow"
          onClick={handleNext}
          aria-label="Next slide"
        >
          <img src={`${baseUrl}img/icons/SliderButtonRight.png`} alt="" />
        </button>
      </div>

      <div className="mainSlider__pagination">
        {slides.map((slide, index) => (
          <button
            type="button"
            key={slide.id}
            className={`mainSlider__dot ${
              activeIndex === index ? 'mainSlider__dot--active' : ''
            }`}
            onClick={() => handleDotClick(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={activeIndex === index ? 'true' : undefined}
          />
        ))}
      </div>
    </div>
  );
};
