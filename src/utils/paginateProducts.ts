export const paginateProducts = <T>(
  products: T[],
  currentPage: number,
  itemsPerPage: number | 'all',
) => {
  const pageSize = itemsPerPage === 'all' ? products.length : itemsPerPage;

  const totalPages = pageSize > 0 ? Math.ceil(products.length / pageSize) : 0;

  const safePage =
    totalPages > 0 ? Math.min(Math.max(currentPage, 1), totalPages) : 1;

  const startIndex = (safePage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const currentProducts = products.slice(startIndex, endIndex);

  return {
    currentProducts,
    totalPages,
    safePage,
  };
};
