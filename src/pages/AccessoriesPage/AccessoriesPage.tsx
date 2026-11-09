import React, { useEffect, useMemo } from 'react';

import accessoriesData from '@/api/accessories.json';

import { BackButton } from '@/components/BackButton';
import { Cart } from '@/components/Cart';
import { CustomSelect } from '@/components/CustomSelect';
import { CustomSelectPage } from '@/components/CustomSelectPage';
import { Loader } from '@/components/Loader';
import { NotFound } from '@/components/NotFound';

import { useFooter } from '@/context/FooterContext';

import { useCatalog } from '@/hooks/useCatalog';
import { useProducts } from '@/hooks/useProducts';

import { EmptyPage } from '@/pages/EmptyPage';
import { PaginationPage } from '@/pages/PaginationPage';

import { paginateProducts } from '@/utils/paginateProducts';
import { sortProducts } from '@/utils/sortProducts';

import './Accessories.scss';

export const AccessoriesPage: React.FC = () => {
  const { products: accessories, isLoading } = useProducts(accessoriesData);
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
    setIsShow(accessories.length > 0);
  }, [accessories.length, setIsShow]);

  const sortedAccessories = useMemo(
    () => sortProducts(accessories, sortType),
    [accessories, sortType],
  );

  const {
    currentProducts: currentAccessories,
    totalPages,
    safePage,
  } = paginateProducts(sortedAccessories, currentPage, itemsPerPage);

  return (
    <div className="accessories container">
      <BackButton title="Accessories" />

      <h2 className="accessories__title">Accessories</h2>

      <p className="accessories__subtitle">
        {accessories.length > 0
          ? `${accessories.length} items`
          : 'No accessories available'}
      </p>

      <div className="accessories__sort">
        <CustomSelect sortType={sortType} onSortChange={handleSortChange} />

        <CustomSelectPage
          onItemsPerPageChange={handleItemsPerPageChange}
          currentItemsPerPage={itemsPerPage.toString()}
        />
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <div className="accessories__wrapper">
          {accessories.length === 0 ? (
            <div className="accessories__no-items">
              <p>There are no accessories</p>
              <NotFound />
            </div>
          ) : currentAccessories.length > 0 ? (
            currentAccessories.map(product => (
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
