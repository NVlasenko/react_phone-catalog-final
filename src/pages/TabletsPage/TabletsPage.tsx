import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import tabletsData from '@/api/tablets.json';

import { BackButton } from '@/components/BackButton';
import { Cart } from '@/components/Cart';
import { CustomSelect } from '@/components/CustomSelect';
import { CustomSelectPage } from '@/components/CustomSelectPage';
import { Loader } from '@/components/Loader';

import { useFooter } from '@/context/FooterContext';
import { useLoader } from '@/context/LoaderContext';

import { EmptyPage } from '@/pages/EmptyPage';
import { PaginationPage } from '@/pages/PaginationPage';

import type { Product, ProductDetailed } from '@/types';

import './TabletsPage.scss';

const transformData = (data: ProductDetailed[]): Product[] => {
  return data.map(item => ({
    ...item,
    itemId: item.id,
    fullPrice: item.priceRegular,
    price: item.priceDiscount,
  }));
};

const extractVersionNumber = (name: string): number => {
  const match = name.match(/\d+/);

  return match ? parseInt(match[0], 10) : 0;
};

export const TabletsPage: React.FC = () => {
  const [tablets, setTablets] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | 'all'>('all');
  const [sortType, setSortType] = useState<string>('newest');

  const { isLoading, setIsLoading } = useLoader();
  const { setIsShow } = useFooter();

  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const initialSortType = params.get('sort') === 'latest' ? 'latest' : 'newest';
  const perPageParam = params.get('perPage') || 'all';
  const pageParam = parseInt(params.get('page') || '1', 10);

  useEffect(() => {
    setIsLoading(true);

    const timeoutId = setTimeout(() => {
      const data = transformData(tabletsData);

      setTablets(data);
      setIsLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [setIsLoading]);

  useEffect(() => {
    const newItemsPerPage =
      perPageParam === 'all' ? tablets.length : parseInt(perPageParam, 10);

    setItemsPerPage(newItemsPerPage);
    setCurrentPage(pageParam);
    setSortType(initialSortType);
  }, [perPageParam, pageParam, initialSortType, tablets.length]);

  useEffect(() => {
    setIsShow(tablets.length > 0);
  }, [tablets.length, setIsShow]);

  const updateUrlParams = (newParams: URLSearchParams) => {
    navigate(`?${newParams.toString()}`);
  };

  const handleSortChange = (selectedSortType: string) => {
    const newParams = new URLSearchParams(location.search);

    newParams.set('sort', selectedSortType);
    updateUrlParams(newParams);
  };

  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage =
      value === 'all' ? tablets.length : parseInt(value, 10);

    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);

    const newParams = new URLSearchParams(location.search);

    newParams.set('perPage', value);
    newParams.set('page', '1');

    updateUrlParams(newParams);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    const newParams = new URLSearchParams(location.search);

    newParams.set('page', page.toString());
    updateUrlParams(newParams);
  };

  const sortedTablets = useMemo(() => {
    const sorted = [...tablets];

    sorted.sort((a, b) => {
      const versionA = extractVersionNumber(a.name);
      const versionB = extractVersionNumber(b.name);

      return sortType === 'latest' ? versionA - versionB : versionB - versionA;
    });

    return sorted;
  }, [tablets, sortType]);

  const pageSize = itemsPerPage === 'all' ? tablets.length : itemsPerPage;

  const indexOfLastTablet = currentPage * pageSize;
  const indexOfFirstTablet = indexOfLastTablet - pageSize;

  const currentTablets = sortedTablets.slice(
    indexOfFirstTablet,
    indexOfLastTablet,
  );

  const totalPages = pageSize > 0 ? Math.ceil(tablets.length / pageSize) : 0;

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
        <CustomSelect onSortChange={handleSortChange} />

        <CustomSelectPage
          onItemsPerPageChange={handleItemsPerPageChange}
          currentItemsPerPage={
            itemsPerPage === tablets.length ? 'all' : itemsPerPage.toString()
          }
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
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};
