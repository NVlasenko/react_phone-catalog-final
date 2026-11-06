import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import phonesData from '@/api/phones.json';

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

import './PhonesPage.scss';

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

export const PhonesPage: React.FC = () => {
  const [phones, setPhones] = useState<Product[]>([]);
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
    const newItemsPerPage =
      perPageParam === 'all' ? phones.length : parseInt(perPageParam, 10);

    setItemsPerPage(newItemsPerPage);
    setCurrentPage(pageParam);
    setSortType(initialSortType);
  }, [perPageParam, pageParam, initialSortType, phones.length]);

  useEffect(() => {
    setIsLoading(true);

    const timeoutId = setTimeout(() => {
      const data = transformData(phonesData);

      setPhones(data);
      setIsLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [setIsLoading]);

  useEffect(() => {
    setIsShow(phones.length > 0);
  }, [phones.length, setIsShow]);

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
      value === 'all' ? phones.length : parseInt(value, 10);

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

  const sortedPhones = useMemo(() => {
    const sorted = [...phones];

    sorted.sort((a, b) => {
      const versionA = extractVersionNumber(a.name);
      const versionB = extractVersionNumber(b.name);

      return sortType === 'latest' ? versionA - versionB : versionB - versionA;
    });

    return sorted;
  }, [phones, sortType]);

  const pageSize = itemsPerPage === 'all' ? phones.length : itemsPerPage;

  const indexOfLastPhone = currentPage * pageSize;
  const indexOfFirstPhone = indexOfLastPhone - pageSize;

  const currentPhones = sortedPhones.slice(indexOfFirstPhone, indexOfLastPhone);

  const totalPages = pageSize > 0 ? Math.ceil(phones.length / pageSize) : 0;

  return (
    <div className="phones container">
      <BackButton title="Phones" />

      <h2 className="phones__title">Mobile Phones</h2>

      <p className="phones__subtitle">
        {phones.length > 0 ? `${phones.length} items` : 'No phones available'}
      </p>

      <div className="phones__sort">
        <CustomSelect onSortChange={handleSortChange} />

        <CustomSelectPage
          onItemsPerPageChange={handleItemsPerPageChange}
          currentItemsPerPage={
            itemsPerPage === phones.length ? 'all' : itemsPerPage.toString()
          }
        />
      </div>

      <div className="phones__wrapper">
        {isLoading ? (
          <Loader />
        ) : phones.length === 0 ? (
          <div className="phones__no-items">There are no phones</div>
        ) : currentPhones.length > 0 ? (
          currentPhones.map(product => (
            <Cart key={product.id} product={product} showDiscount={true} />
          ))
        ) : (
          <EmptyPage />
        )}
      </div>

      {totalPages > 1 && (
        <PaginationPage
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};
