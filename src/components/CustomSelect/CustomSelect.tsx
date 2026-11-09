import React, { useEffect, useRef, useState } from 'react';

import type { SortType } from '@/utils/sortProducts';

import './CustomSelect.scss';

type Props = {
  sortType: SortType;
  onSortChange: (selectedSortType: string) => void;
};

export const CustomSelect: React.FC<Props> = ({ sortType, onSortChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = sortType === 'latest' ? 'Latest' : 'Newest';

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const handleOptionClick = (value: SortType) => {
    onSortChange(value);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="custom-select" ref={dropdownRef}>
      <p className="custom-select__label">Sort By</p>

      <div className="custom-select__dropdown-wrapper">
        <div
          className="custom-select__options"
          aria-label="Sort products by"
          onClick={toggleDropdown}
        >
          {selectedOption}
        </div>

        {isDropdownOpen && (
          <div className="custom-select__dropdown">
            <div
              className="custom-select__option"
              data-value="newest"
              onClick={() => handleOptionClick('newest')}
            >
              Newest
            </div>

            <div
              className="custom-select__option"
              data-value="latest"
              onClick={() => handleOptionClick('latest')}
            >
              Latest
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
