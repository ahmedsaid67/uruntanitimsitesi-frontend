import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import stylesSlider from '@/styles/Vitrin.module.css';
import styles from "./urundetay.module.css";
import { API_ROUTES, API_SERVER_URL } from '@/utils/constants';
import CircularProgress from '@mui/material/CircularProgress'; 
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import PopupWithZoom from '@/compenent/PopupWithZoom';

import { FaArrowLeft, FaArrowRight, FaRegArrowAltCircleDown ,FaRegArrowAltCircleUp} from "react-icons/fa";
import { faL } from '@fortawesome/free-solid-svg-icons';

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
    console.log(bodySizeResponse);
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
  const [showPopup, setShowPopup] = useState(false);

  const [isSliding, setIsSliding] = useState(false);
  const [scrollAmount, setScrollAmount] = useState(1); // Dinamik kaydırma miktarını tutacak state
  const sliderRef = useRef(null);
  const startYRef = useRef(0); // Kaydırma başlangıç pozisyonunu tutacak ref
  const startXRefMain = useRef(0);

  const [activeDot, setActiveDot] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [getMainImage, setMainImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [bodySizes, setBodySizes] = useState([]);

  const itemCount = getImage.length;

  const handleBeforeChange = (current, next) => {
    setIsSliding(true);
  };

  const handleAfterChange = () => {
    setIsSliding(false);
  };

  const handleMouseDown = (e) => {
    startYRef.current = e.clientY; // Kaydırma başlangıç pozisyonunu kaydedin
  };

  const handleMouseUp = (e) => {
    const endY = e.clientY; // Kaydırma bitiş pozisyonunu alın
    const distance = Math.abs(endY - startYRef.current); // Kaydırma mesafesini hesaplayın
    const itemsToScroll = Math.ceil(distance / 100); // Mesafeye göre kaydırılacak öğe sayısını belirleyin
    setScrollAmount(itemsToScroll); // Dinamik kaydırma miktarını ayarlayın

    if (sliderRef.current) {
      sliderRef.current.slickGoTo(itemsToScroll, true); // Kaydırma işlemini gerçekleştirin
    }
  };

// touch move
  const handleTouchStart = (e) => {
    startYRef.current = e.touches[0].clientX; // Track horizontal start position
  };
  
  const handleTouchMove = (e) => {
    const endX = e.touches[0].clientX; // Get horizontal end position
    const distance = endX - startYRef.current; // Positive for swipe right, negative for swipe left
  
    if (Math.abs(distance) > 50) { // Threshold for swipe
      if (distance > 0) {
        // Swipe right
        scrollToImageXNew(activeDot + 1); // Move to the previous image
      } else {
        // Swipe left
        scrollToImageXNew(activeDot - 1); // Move to the next image
      }
      startYRef.current = endX; // Reset start position for continuous swiping
    }
  };
  

  const [lastScrollTime, setLastScrollTime] = useState(0);

const scrollToImageXNew = (id) => {
  const now = Date.now();
  if (now - lastScrollTime < 500) { // Prevent multiple scrolls within 500ms
    return;
  }
  setLastScrollTime(now);

  // Ensure id is within the valid range of image IDs
  const validId = getImage.find(img => img.id === id);
  if (validId && mainImagesRef.current) {
    const element = document.getElementById(id);
    if (element) {
      const offsetLeft = element.offsetLeft - mainImagesRef.current.offsetLeft;
      mainImagesRef.current.scrollTo({
        left: offsetLeft,
        behavior: 'smooth',
      });

      // Update activeDot
      setActiveDot(id);
      setMainImage(id);
    }
  }
};


  

  const handleImageClick = (img, index) => {
    setMainImage(img);
    setCurrentIndex(index);
    setShowPopup(true);
    
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setCurrentIndex(0);

  };

  const handlePopupClick = (e) => {
    if (e.target.className.includes(styles.popup)) {
      handleClosePopup();
    }
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

const scrollToImageX = (id) => {
    const element = document.getElementById(id);
    if (element && mainImagesRef.current) {
      const offsetLeft = element.offsetLeft - mainImagesRef.current.offsetLeft;
      mainImagesRef.current.scrollTo({
        left: offsetLeft,
        behavior: 'smooth',
      });
    }
    setActiveDot(id);
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

  useEffect(() => {
    if (showPopup) {
      // Pop-up açıldığında ve ana sayfada scroll yapılmasını durdur
      document.body.style.overflow = 'hidden';
    } else {
      // Pop-up kapandığında ve ana sayfada scroll yapılmasına izin ver
      document.body.style.overflow = 'auto';
    }
  }, [showPopup]);

  useEffect(() => {
    if (getImage.length > 0) {
      const initialImage = getImage[0].id;
      setMainImage(initialImage);
      setActiveDot(initialImage);
    }
  }, [getImage]);

  const settings = {
    vertical: true,
    verticalSwiping: true,
    infinite: false,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    slidesToShow: 5.5, // Aynı anda kaç öğe göstermek istediğinizi belirtin
    slidesToScroll: scrollAmount, // Dinamik kaydırma miktarını kullanın
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
    vertical: true,
    verticalSwiping: true,
    infinite: false,
    arrows: false,
    slidesToShow: 1,
  }

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
        <div className={styles.styleContainer}>
            <div className={styles.imgContainer}>
                <div className={styles.altImages}>
               
                    <Slider
                        {...settings}
                        className={styles.slider}
                        ref={sliderRef}
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                    >
                        {getImage.map((img, index) => (
                        <Image
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
                            }
                            
                            }}
                        />
                        ))}
                        
                    </Slider>
                   
                </div>
                {/* {itemCount > 5 && (
                    <div className={styles.prevArrow} onClick={() => sliderRef.current.slickPrev()}><FaRegArrowAltCircleUp /></div> )}
                    {itemCount > 5 && (
                      
                    <div className={styles.nextArrow} onClick={() => sliderRef.current.slickNext()}><FaRegArrowAltCircleDown /></div>)} */}
                <div className={styles.mainImages} ref={mainImagesRef}
                >
                    {getImage.map((img, index) => (
                            
                        <Image key={index} src={img.image} alt={img.id}  id={img.id}
                        className={styles.mainImage}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        width={600} height={900}
                        onClick={() => handleImageClick(img.image, index)}
                        />
                        
                        ))}  

                  
                  

                </div>
                <div className={styles.rowDotContainer}>
                                      <>
                                            {getImage.map((img, index) => (
                                              <a
                                              className={`${styles.rowDot} ${activeDot === img.id ? styles.active : ''}`}
                                                key={index}
                                                onClick={(e) => {
                                                  e.preventDefault();
                                                  scrollToImageX(img.id);
                                                  setMainImage(img.id);
                                                }}
                                              ></a>
                                            ))}
                                        </>
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

                <PopupWithZoom
              showPopup={showPopup}
              handleClosePopup={handleClosePopup}
              handlePopupClick={handlePopupClick}
              getMainImage={getMainImage}
              imageSet={getImage}
              currentIndex={currentIndex} // Pass currentIndex to PopupWithZoom
            />
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
