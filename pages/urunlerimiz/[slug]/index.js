import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import stylesSlider from '@/styles/Vitrin.module.css';
import styles from "./urundetay.module.css";
import { API_ROUTES, API_SERVER_URL } from '@/utils/constants';

import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';

import { FaArrowLeft, FaArrowRight, FaRegArrowAltCircleDown ,FaRegArrowAltCircleUp} from "react-icons/fa";


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

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={styles.slicknext}
      style={{ ...style, display: 'block' }}
      onClick={onClick}
    >
      <FaRegArrowAltCircleDown style={{ fontSize: '2em' }} />
    </div>
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={styles.slickprev}
      style={{ ...style, display: 'block' }}
      onClick={onClick}
    >
      <FaRegArrowAltCircleUp style={{ fontSize: '2em' }} />
    </div>
  );
};
const getDataById = async (slug) => {
  try {
    const productsResponse = await axios.get(
      API_ROUTES.URUNLER_DETAIL.replace("id", slug)
    );
    return productsResponse.data;
  } catch (error) {
    console.error("Veri yükleme sırasında bir hata oluştu:", error);
    if (error.response && error.response.status === 404 && error.response.data.detail === "Invalid page.") {
      console.log('Geçersiz sayfa. Bu sayfa mevcut değil veya sayfa numarası hatalı. Lütfen sayfa numarasını kontrol edin.');
    } else {
      console.log('Veriler yüklenirken beklenmeyen bir sorun oluştu. Lütfen daha sonra tekrar deneyin.');
    }
    throw error;
  }
};

const getBodySizeById = async (slug) => {
  try {
    // API_ROUTES.URUNE_AIT_BEDENLER içinde "id" kısmını slug ile değiştirmek için string interpolasyonu kullanılmalı
    const url = API_ROUTES.URUNE_AIT_BEDENLER.replace("id", slug);
    const bodySizeResponse = await axios.get(url);
    return bodySizeResponse.data;
  } catch (error) {
    console.error("Veri yükleme sırasında bir hata oluştu:", error);
    if (error.response && error.response.status === 404 && error.response.data.detail === "Invalid page.") {
      console.log('Geçersiz sayfa. Bu sayfa mevcut değil veya sayfa numarası hatalı. Lütfen sayfa numarasını kontrol edin.');
    } else {
      console.log('Veriler yüklenirken beklenmeyen bir sorun oluştu. Lütfen daha sonra tekrar deneyin.');
    }
    throw error;
  }
};

const getImageById = async (slug) => {
  try {
    const productsResponse = await axios.get(
      API_ROUTES.ALBUM_IMAGES_KATEGORI_FILTER.replace("seciliKategori", slug)
    );
    return productsResponse.data;
  } catch (error) {
    console.error("Veri yükleme sırasında bir hata oluştu:", error);
    if (error.response && error.response.status === 404 && error.response.data.detail === "Invalid page.") {
      console.log('Geçersiz sayfa. Bu sayfa mevcut değil veya sayfa numarası hatalı. Lütfen sayfa numarasını kontrol edin.');
    } else {
      console.log('Veriler yüklenirken beklenmeyen bir sorun oluştu. Lütfen daha sonra tekrar deneyin.');
    }
  }
};

const getCategoryBySlug = async (slug) => {
  try {
    const url = API_ROUTES.URUNLER_KATEGORI_FILTER_PAGINATIONSUZ.replace("seciliKategori", slug);
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Kategori verisi yüklenirken bir hata oluştu:", error);
    throw error;
  }
};

const UrunDetay = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [getData, setData] = useState([]);
  const [getImage, setImage] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mainImagesRef = useRef(null);
  const sliderRefMain = useRef(null);

  const [isSliding, setIsSliding] = useState(false);
  const sliderRef = useRef(null);

  const [activeImage, setActiveImage] = useState(null);

  const [bodySizes, setBodySizes] = useState([]);


  const handleBeforeChange = (current, next) => {
    setIsSliding(true);
  };

  const handleAfterChange = () => {
    setIsSliding(false);
  };

  

  
  


  

  const scrollToImage = (id) => {
    const element = document.getElementById(id);
    
    if (element && mainImagesRef.current) {
      const offsetTop = element.offsetTop - mainImagesRef.current.offsetTop;
      mainImagesRef.current.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
    setActiveImage(id);
};



  useEffect(() => {
    if (!slug) return;

    const lastDashIndex = slug.lastIndexOf('-');
    const id = slug.substring(lastDashIndex + 1);

    const loadData = async () => {
      setLoading(true);
      try {
        const result = await getDataById(id);
        setData(result);
        
        const imageResult = await getImageById(id);
        setImage(imageResult);

        const resultNew = await getCategoryBySlug(result.urun_kategori.slug);
        setProducts(resultNew.results);

        const resultBodySize = await getBodySizeById(id);
        const filteredSizes = resultBodySize.filter(size => size.durum);
        setBodySizes(filteredSizes);
       

        setError(null);
      } catch (error) {
        setError('Veriler yüklenirken beklenmeyen bir sorun oluştu. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug]);


  const settings = {
    vertical: true,
    verticalSwiping: true,
    infinite: false,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    slidesToShow: 5.5, // Aynı anda kaç öğe göstermek istediğinizi belirtin
    beforeChange: handleBeforeChange,
    afterChange: handleAfterChange,
    responsive: [
        {
          breakpoint: 1200, // For screens 1200px and up
          settings: {
            slidesToShow: 8
          }
        },
    ],
  
  };

  const settingsMain = {
    dots: true, // Noktalar her zaman aktif
    infinite: false,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    vertical: true, // Varsayılan olarak masaüstü dikey
    verticalSwiping: true,
    responsive: [
      {
        breakpoint: 768, // Tablet ve altı cihazlar için
        settings: {
          dots: true,
          vertical: false, // Tablet ve mobilde yatay düzen
          verticalSwiping: false,
        },
      },
      {
        breakpoint: 576, // Mobil cihazlar için
        settings: {
          dots: true,
          vertical: false, // Mobilde de yatay düzen
          verticalSwiping: false,
        },
      },
    ],
  };
  

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
          infinite: products.length > 2 
        },
      },
      {
        breakpoint: 1024,

        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: products.length > 3
        },
      },
    ],
  };

  if (loading) {
    return <div>
      <div className={styles.loadImage}></div>
      <div className={styles.loadSlider}></div>
    </div>;
  }

  if (error) {
    return <div className={styles.errorMessage}>{error}</div>;
  }

  if (!getData) {
    return <div className={styles.noDataMessage}>Ürün bulunamadı.</div>;
  }

  return (
    <div>
      <Head>
        <title>Flexsoft | {getData.baslik}</title>
        <meta name="description" content="Flexsoft bir e-ticaret sitesidir ve yazılım hizmetleri vermektedir. Butik ve giyim mağazalarına yöneliktir." />
        <meta name="keywords" content={`e-ticaret, yazılım, butik, giyim mağazaları,site satın al,web site satın al,hazır site satın al,web site kurma,web site tasarımı,butik web site,butik web site satın al,mağaza web site satın al,web site fiyatları, ${getData.baslik}, ${getData.urun_kategori.baslik}`} />
        <meta property="og:title" content={`Flexsoft | ${getData.baslik}`} />
        <meta property="og:description" content={`Flexsoft bir e-ticaret sitesidir ve yazılım hizmetleri vermektedir. Butik ve giyim mağazalarına yöneliktir. Ürün: ${getData.baslik}, Kategori: ${getData.urun_kategori.baslik}`} />
        <meta property="og:type" content="website" />
      </Head>
        <div className={styles.styleContainer}>
            <div className={styles.imgContainer}>
                <div className={styles.altImages}>
               
                    <Slider
                        {...settings}
                        className={styles.slider}
                        ref={sliderRef}
                    >
                        {getImage.map((img, index) => (
                        <img
                            key={index}
                            src={img.image}
                            alt=""
                            className={`${styles.altImage} ${activeImage === img.id ? styles.active : ''}`}
                            width={800}
                            height={1200}
                            onClick={(e) => {
                            e.preventDefault();
                            if (!isSliding) {
                                scrollToImage(img.id);
                                sliderRefMain.current.slickGoTo(index);
                            }
                            
                            }}
                        />
                        ))}
                        
                    </Slider>
                   
                </div>
                
                 <div className={styles.mainImages} ref={mainImagesRef}>
                    <Slider {...settingsMain} ref={sliderRefMain}>
                        {getImage.map((img, index) => (
                            
                            <img key={index} src={img.image} alt={img.id}  id={img.id}
                            className={styles.mainImage}
                            
                            width={800} height={1200}
                            />
                            
                            ))}  
                    </Slider>

                  
                  

                </div>
                
               
            </div>
            
            <div className={styles.detailContainer}>

              <div className={styles.detailContent}>      
                        <p className={styles.detailText}>{getData.baslik}</p>

                         {getData.fiyat && <p className={styles.detailPrice}>{getData.fiyat}</p>}
                        {/* eğer ticaret sitesi ise */}
                        <div className={styles.boxContainer}>
                        {bodySizes.map(size => (
                          <span key={size.id} className={styles.box}>
                            {size.numara}
                          </span>
                        ))}
                        </div>
                        
              </div>    
              
  
            </div>

              
        </div>
        


        <div className={stylesSlider.showcaseContainer}>
          <div className={stylesSlider.mainContainer}>
            <div className={stylesSlider.leftContainer}>
              <h2>İlginizi Çekebilecek Ürünler</h2>
              <Slider {...sliderSettings}>
                {products.map(product => (
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
                    <p className={stylesSlider.productItemPrice}>{product.fiyat ? `${product.fiyat} TL` : ''}</p>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      
    </div>
  );
};

export default UrunDetay;
