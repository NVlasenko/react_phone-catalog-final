import React, { useCallback, useEffect, useState } from 'react';
import { images } from '@/api/apiImage';
import './MainSlider.scss';

export const MainSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handlePrevious = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex(prevIndex =>
          prevIndex === 0 ? images.length - 1 : prevIndex - 1,
        );
      }, 500);
    }
  };

  const handleNext = useCallback(() => {
    if (!isAnimating) {
      setIsAnimating(true);

      setTimeout(() => {
        setCurrentIndex(prevIndex =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1,
        );
      }, 500);
    }
  }, [isAnimating]);

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 500);

      return () => clearTimeout(timer);
    }

    return;
  }, [isAnimating]);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [handleNext]);

  const switchLineClickHandler = (index: number) => {
    setCurrentIndex(index);
    setIsAnimating(true);
  };

  const renderSwitchLines = () => {
    return images.map((_, index) => (
      <button
        key={index}
        className={`switch__line ${currentIndex === index ? 'active' : ''}`}
        onClick={() => switchLineClickHandler(index)}
      ></button>
    ));
  };

  return (
    <div className="mainSlider">
      <div className="mainSlider__wrapper">
        <img
          src={`${import.meta.env.BASE_URL}img/icons/SliderButtonLeft.png`}
          alt="sliderLeft"
          className="slider"
          onClick={handlePrevious}
        />
        <img
          src={images[currentIndex]}
          alt="banner"
          className={`mainSlider__img ${isAnimating ? 'fade-out' : 'fade-in'}`}
        />
        <img
          src={`${import.meta.env.BASE_URL}img/icons/SliderButtonRight.png`}
          alt="sliderRight"
          className="slider"
          onClick={handleNext}
        />
      </div>
      <div className="switch">{renderSwitchLines()}</div>
    </div>
  );
};
