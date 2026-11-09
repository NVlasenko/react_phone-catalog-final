import { useSearchParams } from 'react-router-dom';

import type { SortType } from '@/utils/sortProducts';

export const useCatalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const sortType: SortType =
    searchParams.get('sort') === 'latest' ? 'latest' : 'newest';

  const perPageParam = searchParams.get('perPage') ?? 'all';
  const pageParam = Number(searchParams.get('page') ?? '1');

  const currentPage =
    Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;

  const itemsPerPage: number | 'all' =
    perPageParam === 'all' ||
    !Number.isInteger(Number(perPageParam)) ||
    Number(perPageParam) <= 0
      ? 'all'
      : Number(perPageParam);

  const handleSortChange = (selectedSortType: string) => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);

      params.set('sort', selectedSortType);
      params.set('page', '1');

      return params;
    });
  };

  const handleItemsPerPageChange = (value: string) => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);

      params.set('perPage', value);
      params.set('page', '1');

      return params;
    });
  };

  const handlePageChange = (page: number) => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);

      params.set('page', page.toString());

      return params;
    });
  };

  return {
    sortType,
    currentPage,
    itemsPerPage,
    handleSortChange,
    handleItemsPerPageChange,
    handlePageChange,
  };
};
