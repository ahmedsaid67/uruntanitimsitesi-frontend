'use client';

import React from 'react';
import Slider from 'react-slick';
import Link from 'next/link';
import stylesSlider from '@/styles/UrunVitrin.module.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const CustomPrevArrow = ({ onClick }) => (
  <div className={stylesSlider.customPrevArrow} onClick={onClick}>
    <FaArrowLeft />
  </div>
);

const CustomNextArrow = ({ onClick }) => (
  <div className={stylesSlider.customNextArrow} onClick={onClick}>
    <FaArrowRight />
  </div>
);

const RelatedProducts = ({ products, currentProductId }) => {
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    infinite: products.length > 4,
    slidesToScroll: 1,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: products.length > 2,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: products.length > 3,
        },
      },
    ],
  };

  return (
    <div className={stylesSlider.showcaseContainer}>
      <h2 className={stylesSlider.baslik}>İlginizi Çekebilecek Ürünler</h2>
      <Slider {...sliderSettings}>
        {products
          .filter((product) => product.id !== currentProductId) // Mevcut ürünü filtrele
          .map((product) => (
            <div key={product.id} className={stylesSlider.productItem}>
              <Link href={`/urunlerimiz/${product.slug}`}>
                <img
                  className={stylesSlider.productItemImage}
                  src={product.kapak_fotografi}
                  alt={product.baslik}
                />
              </Link>
              <Link href={`/urunlerimiz/${product.slug}`}>
                <p className={stylesSlider.productItemTitle}>{product.baslik}</p>
              </Link>
              <p className={stylesSlider.productItemPrice}>
                {product.fiyat ? `${product.fiyat} TL` : ''}
              </p>
            </div>
          ))}
      </Slider>
    </div>
  );
};

export default RelatedProducts;