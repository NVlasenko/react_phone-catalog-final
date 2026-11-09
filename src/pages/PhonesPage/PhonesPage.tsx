import React, { useEffect, useMemo } from 'react';

import phonesData from '@/api/phones.json';

import { BackButton } from '@/components/BackButton';
import { Cart } from '@/components/Cart';
import { CustomSelect } from '@/components/CustomSelect';
import { CustomSelectPage } from '@/components/CustomSelectPage';
import { Loader } from '@/components/Loader';

import { useFooter } from '@/context/FooterContext';

import { useCatalog } from '@/hooks/useCatalog';
import { useProducts } from '@/hooks/useProducts';

import { EmptyPage } from '@/pages/EmptyPage';
import { PaginationPage } from '@/pages/PaginationPage';

import { paginateProducts } from '@/utils/paginateProducts';
import { sortProducts } from '@/utils/sortProducts';

import './PhonesPage.scss';

export const PhonesPage: React.FC = () => {
  const { products: phones, isLoading } = useProducts(phonesData);
  const { setIsShow } = useFooter();

  const {
    sortType,
    currentPage,
    itemsPerPage,
    handleSortChange,
    handleItemsPerPageChange,
    handlePageChange,
  } = useCatalog();

  useEffect(() => {
    setIsShow(phones.length > 0);
  }, [phones.length, setIsShow]);

  const sortedPhones = useMemo(
    () => sortProducts(phones, sortType),
    [phones, sortType],
  );

  const {
    currentProducts: currentPhones,
    totalPages,
    safePage,
  } = paginateProducts(sortedPhones, currentPage, itemsPerPage);

  return (
    <div className="phones container">
      <BackButton title="Phones" />

      <h2 className="phones__title">Mobile Phones</h2>

      <p className="phones__subtitle">
        {phones.length > 0 ? `${phones.length} items` : 'No phones available'}
      </p>

      <div className="phones__sort">
        <CustomSelect sortType={sortType} onSortChange={handleSortChange} />

        <CustomSelectPage
          onItemsPerPageChange={handleItemsPerPageChange}
          currentItemsPerPage={itemsPerPage.toString()}
        />
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <div className="phones__wrapper">
          {phones.length === 0 ? (
            <div className="phones__no-items">There are no phones</div>
          ) : currentPhones.length > 0 ? (
            currentPhones.map(product => (
              <Cart key={product.id} product={product} showDiscount={true} />
            ))
          ) : (
            <EmptyPage />
          )}
        </div>
      )}

      {totalPages > 1 && !isLoading && (
        <PaginationPage
          currentPage={safePage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};
