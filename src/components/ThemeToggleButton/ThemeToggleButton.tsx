import React from 'react';

import { useTheme } from '@/context/ThemeProvider';

import './ThemeToggleButton.scss';

export const ThemeToggleButton: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const handleClick = () => {
    const newTheme = theme === 'default-theme' ? 'dark-theme' : 'default-theme';

    setTheme(newTheme);
  };

  return (
    <button
      className={`theme-toggle ${theme === 'dark-theme' ? 'active' : 'default-theme'}`}
      onClick={handleClick}
    >
      <span
        className={`toggle-circle ${theme === 'dark-theme' ? 'active' : 'default-theme'}`}
      ></span>
    </button>
  );
};
