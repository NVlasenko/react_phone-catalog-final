import React, { useEffect, useMemo } from 'react';

import tabletsData from '@/api/tablets.json';

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

import './TabletsPage.scss';

export const TabletsPage: React.FC = () => {
  const { products: tablets, isLoading } = useProducts(tabletsData);
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
    setIsShow(tablets.length > 0);
  }, [tablets.length, setIsShow]);

  const sortedTablets = useMemo(
    () => sortProducts(tablets, sortType),
    [tablets, sortType],
  );

  const {
    currentProducts: currentTablets,
    totalPages,
    safePage,
  } = paginateProducts(sortedTablets, currentPage, itemsPerPage);

  return (
    <div className="tablets container">
      <BackButton title="Tablets" />

      <h2 className="tablets__title">Tablets</h2>

      <p className="tablets__subtitle">
        {tablets.length > 0
          ? `${tablets.length} items`
          : 'No tablets available'}
      </p>

      <div className="tablets__sort">
        <CustomSelect sortType={sortType} onSortChange={handleSortChange} />

        <CustomSelectPage
          onItemsPerPageChange={handleItemsPerPageChange}
          currentItemsPerPage={itemsPerPage.toString()}
        />
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <div className="tablets__wrapper">
          {tablets.length === 0 ? (
            <div className="tablets__no-items">There are no tablets</div>
          ) : currentTablets.length > 0 ? (
            currentTablets.map(product => (
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
