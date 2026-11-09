import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  determineCategoryByProductId,
  getProductAPI,
  getProductsByName,
} from '@/api/api';

import { colorCodes } from '@/colorCodes/colorCodes';

import { BackButton } from '@/components/BackButton';
import { CartControls } from '@/components/CartControls';
import { Loader } from '@/components/Loader';
import { NewItems } from '@/components/NewItems';
import { PhoneSpecs } from '@/components/PhoneSpecs';
import { PriceDisplay } from '@/components/PriceDisplay';

import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useProductCategoryContext } from '@/context/ProductCategoryProvider';

import { EmptyPage } from '@/pages/EmptyPage';

import type { ProductDetailed, ProductWithSerialNumber } from '@/types';

import { toProduct } from '@/utils/toProduct';

import '@/components/PhoneSpecs/PhoneSpecs.scss';
import './ProductDetailPage.scss';

export const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const { productType, setProductType } = useProductCategoryContext();

  const { addToCart, removeItem, isInCart } = useCart();

  const { addToFavorites, removeFromFavorites, isInFavorites } = useFavorites();

  const [product, setProduct] = useState<ProductWithSerialNumber | null>(null);

  const [allProducts, setAllProducts] = useState<ProductWithSerialNumber[]>([]);

  const [activeImage, setActiveImage] = useState<string | null>(null);

  const [errors, setErrors] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const requestIdRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const requestId = ++requestIdRef.current;
    const startedAt = Date.now();

    const loadProduct = async () => {
      setLoading(true);
      setErrors(null);
      setProduct(null);
      setAllProducts([]);
      setActiveImage(null);

      try {
        if (!productId) {
          throw new Error('Product ID is missing');
        }

        const category = await determineCategoryByProductId(productId);

        const apiMethod = getProductAPI(category);
        const fetchedProduct: ProductDetailed | null =
          await apiMethod(productId);

        if (!fetchedProduct) {
          if (!cancelled && requestId === requestIdRef.current) {
            setProduct(null);
          }

          return;
        }

        const relatedProducts = await getProductsByName(
          category,
          fetchedProduct.namespaceId,
        );

        const products: ProductWithSerialNumber[] = relatedProducts.map(
          (item, index) => ({
            ...item,
            serialNumber: index + 1,
          }),
        );

        const currentProduct = products.find(
          item => item.id === fetchedProduct.id,
        ) ?? {
          ...fetchedProduct,
          serialNumber: products.length + 1,
        };

        if (cancelled || requestId !== requestIdRef.current) {
          return;
        }

        setProductType(category);
        setAllProducts(products);
        setProduct(currentProduct);
        setActiveImage(currentProduct.images[0] ?? null);
      } catch {
        if (!cancelled && requestId === requestIdRef.current) {
          setErrors('Error fetching product data.');
          setProduct(null);
        }
      } finally {
        const elapsed = Date.now() - startedAt;
        const remaining = Math.max(0, 1000 - elapsed);

        await new Promise<void>(resolve => {
          setTimeout(resolve, remaining);
        });

        if (!cancelled && requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    };

    void loadProduct();

    return () => {
      cancelled = true;
    };
  }, [productId, setProductType]);

  const isAdded = product ? isInCart(product.id) : false;

  const isLiked = product ? isInFavorites(product.id) : false;

  const handleColorChange = (color: string) => {
    if (!product || color === product.color) {
      return;
    }

    const updatedProduct = allProducts.find(
      item => item.color === color && item.capacity === product.capacity,
    );

    if (!updatedProduct) {
      setErrors('Product with selected color and capacity not found.');

      return;
    }

    setErrors(null);
    navigate(`/${productType}/${updatedProduct.id}`);
  };

  const handleCapacityChange = (capacity: string) => {
    if (!product || capacity === product.capacity) {
      return;
    }

    const updatedProduct = allProducts.find(
      item => item.color === product.color && item.capacity === capacity,
    );

    if (!updatedProduct) {
      setErrors('Product with selected color and capacity not found.');

      return;
    }

    setErrors(null);
    navigate(`/${productType}/${updatedProduct.id}`);
  };

  const handleAddToCart = () => {
    if (!product) {
      return;
    }

    if (isAdded) {
      removeItem(product.id);
    } else {
      addToCart(toProduct(product));
    }
  };

  const handleToggleFavorite = () => {
    if (!product) {
      return;
    }

    if (isLiked) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(toProduct(product));
    }
  };

  const recommendedProducts = useMemo(() => {
    if (!product) {
      return [];
    }

    const extractModelName = (name: string) =>
      name.split(' ').slice(0, -2).join(' ');

    const modelName = extractModelName(product.name);

    return allProducts
      .filter(
        item =>
          item.id !== product.id && extractModelName(item.name) === modelName,
      )
      .slice(0, 10)
      .map(toProduct);
  }, [allProducts, product]);

  const formatProductName = (
    name: string,
    capacity: string | undefined,
    category: string,
  ): string => {
    switch (category) {
      case 'phones':
        return name.replace(/(\d+GB|\d+TB)/, capacity || '');

      case 'tablets':
        return `${name}${capacity ? ` (${capacity})` : ''}`;

      case 'accessories':
        return name;

      default:
        return name;
    }
  };

  if (loading) {
    return (
      <div className="productDetail">
        <div className="loader__top">
          <Loader />
        </div>
      </div>
    );
  }

  if (errors && !product) {
    return (
      <div className="productDetail__error container">
        <h1>Product not found</h1>
        <p>Sorry, we couldn&apos;t find this product.</p>
      </div>
    );
  }

  if (!product) {
    return <EmptyPage />;
  }

  const productNameWithCapacity = formatProductName(
    product.name,
    product.capacity,
    productType,
  );

  return (
    <div className="productDetail">
      <div className="container">
        <BackButton
          title={
            productType === 'phones'
              ? 'Phones'
              : productType.charAt(0).toUpperCase() + productType.slice(1)
          }
          isFullDetailsOfProduct={true}
          nameProduct={productNameWithCapacity}
        />

        <div className="productDetail">
          <h1 className="productDetail__name">{productNameWithCapacity}</h1>

          <div className="productDetail__wrapper">
            <div className="productDetail__images">
              {activeImage && (
                <img
                  src={`${import.meta.env.BASE_URL}${activeImage.replace(/^\/+/, '')}`}
                  alt={`${productNameWithCapacity} - Active`}
                  className="productDetail__image--active"
                />
              )}

              <div className="productDetail__thumbnails">
                {product.images.map(image => (
                  <img
                    key={image}
                    src={`${import.meta.env.BASE_URL}${image.replace(/^\/+/, '')}`}
                    alt={`${productNameWithCapacity} - Thumbnail`}
                    className={`productDetail__image ${
                      image === activeImage ? 'selected' : ''
                    }`}
                    onClick={() => setActiveImage(image)}
                  />
                ))}
              </div>
            </div>

            <div className="productDetail__info">
              <div className="productDetail__color">
                <div className="color--wrapper">
                  <p className="text">Available colors</p>
                  <p className="text mr">Id: {product.serialNumber}</p>
                </div>

                <div className="color">
                  {product.colorsAvailable.map(color => {
                    const colorKey = color.replace(/\s+/g, '_');

                    return (
                      <button
                        key={colorKey}
                        className={`color__option ${
                          colorKey === product.color ? 'selected' : ''
                        }`}
                        style={{
                          backgroundColor: colorCodes[colorKey] || '#fff',
                        }}
                        onClick={() => handleColorChange(colorKey)}
                        title={color}
                      />
                    );
                  })}
                </div>
              </div>

              <hr className="line" />

              <div className="productDetail__capacity">
                <p className="text">Select capacity</p>

                <div className="productDetail__memoryPhone">
                  {product.capacityAvailable.map(capacity => (
                    <button
                      key={capacity}
                      className={`memory__option ${
                        capacity === product.capacity ? 'selected' : ''
                      }`}
                      onClick={() => handleCapacityChange(capacity)}
                    >
                      {capacity}
                    </button>
                  ))}
                </div>
              </div>

              {errors && <p role="alert">{errors}</p>}

              <hr className="line" />

              <div className="productDetail__price">
                <PriceDisplay
                  priceRegular={product.priceRegular}
                  priceDiscount={product.priceDiscount}
                  showDiscount={true}
                />
              </div>

              <div className="productDetail__add">
                <CartControls
                  isAdded={isAdded}
                  isLiked={isLiked}
                  onAddToCart={handleAddToCart}
                  onToggleFavorite={handleToggleFavorite}
                />

                <PhoneSpecs
                  screen={product.screen}
                  capacity={product.capacity}
                  ram={product.ram}
                  color={product.color}
                />
              </div>
            </div>
          </div>

          <div className="productDetail__characteristics">
            <div className="productDetail__list">
              <p className="title">About</p>
              <hr className="line" />

              {product.description.map((desc, index) => (
                <div key={index} className="productDetail__list--top">
                  <p className="subtitle">{desc.title}</p>

                  <p className="text">
                    {desc.text.map((line, i) => (
                      <span className="text__inf" key={i}>
                        {line}
                        <br />
                        <br />
                      </span>
                    ))}
                  </p>
                </div>
              ))}
            </div>

            <div className="productDetail__tech">
              <p className="title">Tech specs</p>
              <hr className="line" />

              <div className="phone-specs productDetail__tech--top">
                <div className="phone-specs__param">
                  <p className="phone-specs__text">Screen</p>
                  <p className="phone-specs__size">
                    {product.screen.slice(0, 9)}
                  </p>
                </div>

                <div className="phone-specs__param">
                  <p className="phone-specs__text">Resolution</p>
                  <p className="phone-specs__size">{product.resolution}</p>
                </div>

                <div className="phone-specs__param">
                  <p className="phone-specs__text">Processor</p>
                  <p className="phone-specs__size">{product.processor}</p>
                </div>

                <div className="phone-specs__param">
                  <p className="phone-specs__text">RAM</p>
                  <p className="phone-specs__size">
                    {product.ram.slice(0, 1)} GB
                  </p>
                </div>

                <div className="phone-specs__param">
                  <p className="phone-specs__text">Built in memory</p>
                  <p className="phone-specs__size">{product.capacity} GB</p>
                </div>

                <div className="phone-specs__param">
                  <p className="phone-specs__text">Camera</p>
                  <p className="phone-specs__size">{product.camera}</p>
                </div>

                <div className="phone-specs__param">
                  <p className="phone-specs__text">Zoom</p>
                  <p className="phone-specs__size">{product.zoom}</p>
                </div>

                <div className="phone-specs__param">
                  <p className="phone-specs__text">Cell</p>
                  <p className="phone-specs__size phone-specs__size--cell">
                    {product.cell.join(', ')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <NewItems
          product={recommendedProducts}
          title="You may also like"
          showDiscount={true}
        />
      </div>
    </div>
  );
};
