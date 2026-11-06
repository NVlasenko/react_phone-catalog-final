export type ProductDetailed = {
  id: string;
  namespaceId: string;
  category: string;
  name: string;
  capacityAvailable: string[];
  capacity: string;
  priceRegular: number;
  priceDiscount: number;
  colorsAvailable: string[];
  color: string;
  images: string[];
  description: {
    title: string;
    text: string[];
  }[];
  screen: string;
  resolution: string;
  processor: string;
  ram: string;
  camera?: string;
  zoom?: string;
  cell: string[];
};

export type ProductWithSerialNumber = ProductDetailed & {
  serialNumber: number;
};

export type Product = {
  namespaceId?: string;
  priceDiscount: number;
  priceRegular: number;
  id: string;
  category: string;
  itemId: string;
  name: string;
  capacity: string;
  fullPrice: number;
  price: number;
  color: string;
  images: string[];
  screen: string;
  ram: string;
  year?: number;
};
