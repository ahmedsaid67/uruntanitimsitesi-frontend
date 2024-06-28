import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from '../styles/Vitrin.module.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { API_ROUTES } from '@/utils/constants';
import CircularProgress from '@mui/material/CircularProgress'; 
import Link from 'next/link';


const CustomPrevArrow = ({ onClick }) => (
  <div className={styles.customPrevArrow} onClick={onClick}>
    <FaArrowLeft />
  </div>
);

const CustomNextArrow = ({ onClick }) => (
  <div className={styles.customNextArrow} onClick={onClick}>
    <FaArrowRight />
  </div>
);

const Vitrin = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [tabs, setTabs] = useState([]);
  const [products, setProducts] = useState([]);
  const [variant, setVariant] = useState('fullWidth');

  const scrollContainerRef = useRef(null);
  const [isLeftArrowVisible, setIsLeftArrowVisible] = useState(false);
  const [isRightArrowVisible, setIsRightArrowVisible] = useState(false);
  const [isHorizontalContainerHovered, setIsHorizontalContainerHovered] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTabsAndProducts = async () => {
      try {
        const response = await axios.get(API_ROUTES.URUN_VITRIN_ACTIVE);
        const tabsData = response.data;
        setTabs(tabsData);
        if (tabsData.length > 0) {
          setActiveTab(tabsData[0].id);
          fetchProducts(tabsData[0].id);
        } else {
          setActiveTab(null);
        }
      } catch (error) {
        console.error('Error fetching tabs or products:', error);
        setActiveTab(null);
      }
    };

    fetchTabsAndProducts();
  }, []);


  const setActiveTabAndFetchProducts = async (tabId) => {
    setActiveTab(tabId);
    await fetchProducts(tabId);

  };


  const fetchProducts = async (tabId) => {
    setIsLoading(true)
    try {
      const response = await axios.get(API_ROUTES.URUNLER_VITRIN_KATEGORI_FILTER_PAGINATIONSUZ.replace("seciliKategori",tabId));
      setProducts(response.data.results);
    } catch (error) {
      console.error('Error fetching products:', error);
    }finally {
      setIsLoading(false); // Yükleme işlemi tamamlandığında veya hata oluştuğunda
    }
  };

  



  const checkAndScrollTabIntoView = (newValue) => {
    const activeTabElement = document.querySelector(`.${styles.kategoriItemTitle}[data-slug='${newValue.slug}']`);

    if (activeTabElement && variant === 'scrollable') {
        const tabStartX = activeTabElement.getBoundingClientRect().x;
        const tabEndX = tabStartX + activeTabElement.offsetWidth;
        const containerWidth = window.innerWidth;
        const tabPadding = 16; // Padding değeri
        const tabMargin = 0; // Margin değeri

        // Eğer sekmenin başlangıç veya bitiş x değeri ekranın dışındaysa, kaydırma yap
        if (tabStartX < 0 || tabEndX > containerWidth) {
            let scrollAmount = 0;
            if (tabStartX < 0) {
                // Sekmenin başlangıç x değeri ekranın solunda ise, başlangıç x değerini ekranın soluna getir
                scrollAmount = tabStartX - tabPadding - tabMargin;
            } else if (tabEndX > containerWidth) {
                // Sekmenin bitiş x değeri ekranın sağında ise, bitiş x değerini ekranın sağında getir
                scrollAmount = tabEndX - containerWidth + tabPadding + tabMargin;
            }

            // Kaydırma işlemi
            if (scrollContainerRef.current) {
                scrollContainerRef.current.style.transition = 'left 0.5s'; // Animasyon süresi 0.5 saniye
                scrollContainerRef.current.scrollLeft += scrollAmount;
            }
      }
    }
  };



  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    setActiveTabAndFetchProducts(newValue.id);
    checkAndScrollTabIntoView(newValue)
  };

  

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollContainer = scrollContainerRef.current;
      const containerWidth = window.innerWidth;
      const currentScrollLeft = scrollContainer.scrollLeft;

      // Calculate the new scroll position based on container width
      const newScrollLeft = Math.max(currentScrollLeft - containerWidth * 0.8, 0); // 80% of the container width
      scrollContainer.scrollTo({ left: newScrollLeft, behavior: 'smooth' });


    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollContainer = scrollContainerRef.current;
      const containerWidth = window.innerWidth;
      const currentScrollLeft = scrollContainer.scrollLeft;
      const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
  
      // Calculate the new scroll position based on container width
      const newScrollLeft = Math.min(currentScrollLeft + containerWidth * 0.8, maxScrollLeft); // 80% of the container width
      scrollContainer.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
  
      
    }
  };

  

  useEffect(() => {
    const calculateTabWidths = () => {
      if (tabs.length > 0 && scrollContainerRef.current) {
        const containerWidth = window.innerWidth - 32;  // -32 sebebi sağdan soldan margın farkı
        const kategoriItems = scrollContainerRef.current.querySelectorAll(`.${styles.kategoriItemTitle}`);

        let totalTabsWidth = 0;
        kategoriItems.forEach((item) => {
          totalTabsWidth += item.offsetWidth + 16;
        });



        if (totalTabsWidth > containerWidth) {
          setVariant('scrollable');
        } else {
          setVariant('fullWidth');
        }
      }
    };

    // Calculate tab widths after DOM updates
    calculateTabWidths();
    window.addEventListener('resize', calculateTabWidths);
    return () => {
      window.removeEventListener('resize', calculateTabWidths);
    };
  }, [tabs]);


  useEffect(() => {
    const updateArrowVisibility = () => {
      if (scrollContainerRef.current) {
        const scrollContainer = scrollContainerRef.current;
        const isAtLeft = Math.abs(scrollContainer.scrollLeft) < 1;
        const isAtRight = Math.abs(scrollContainer.scrollLeft - (scrollContainer.scrollWidth - scrollContainer.clientWidth)) < 1;


        setIsLeftArrowVisible(!isAtLeft);
        setIsRightArrowVisible(!isAtRight);
      }
    };
  
    if (scrollContainerRef.current) {
      updateArrowVisibility();
      scrollContainerRef.current.addEventListener('scroll', updateArrowVisibility);
    }
  
    return () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.removeEventListener('scroll', updateArrowVisibility);
      }
    };
  }, [scrollContainerRef, tabs]);


  
  

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

  return (
    <div className={styles.showcaseContainer}>
      <div className={styles.mainContainer} >
      <div className={styles.leftContainer}>
            <div className={styles.LeftBoxContainer}>

              <div
                className={variant === 'scrollable' ? styles.horizontalContainer : styles.horizontalContainerFullWidth}
                onMouseEnter={() => {
                  if (variant === 'scrollable') {
                    setIsHorizontalContainerHovered(true);
                  }
                }}
                onMouseLeave={() => {
                  if (variant === 'scrollable') {
                    setIsHorizontalContainerHovered(false);
                  }
                }}
              >
                {variant === 'scrollable' && (
                  <div  className={styles.leftArrow} onClick={handleScrollLeft}  
                        style={{
                          display: (isLeftArrowVisible && isHorizontalContainerHovered) ? 'block' : 'none',
                        }}>
                    <FaArrowLeft />
                  </div>
                )}
                <div className={variant === 'scrollable' ? styles.scrollable : styles.fullWidht} ref={scrollContainerRef}>
                  { tabs.map((kategori, index) => (
                    <div key={index}
                      className={styles.horizontalCLick }
                      style={{ 
                        borderBottom: kategori.id === activeTab ? '3px solid black' : 'none'
                      }}
                      onClick={ () => handleTabChange(kategori) }
                    >
                      <span
                        className={styles.kategoriItemTitle}
                        data-slug={kategori.slug} 
                        style={{ 
                          color: kategori.id === activeTab ? 'black' : '#666',
                          fontWeight: kategori.id === activeTab ? 'bold' : 'normal',
                        }}
                      >
                        {kategori.baslik}
                      </span>
                    </div>
                  ))}
                </div>
                {variant === 'scrollable' && (
                  <div 
                    className={styles.rightArrow} 
                    onClick={handleScrollRight} 
                    style={{
                      display: (isRightArrowVisible && isHorizontalContainerHovered) ? 'block' : 'none',
                  }}>
                    <FaArrowRight />
                  </div>
                )}
              </div>

             
            </div>
          </div>
          {isLoading ? (
              <div className={styles.loader}>
                  <CircularProgress style={{ color: 'black' }}/> {/* Yükleme göstergesi */}
              </div>
          ) :(
              <Slider {...sliderSettings}>
                {products.map(product => (
                  <div key={product.id} className={styles.productItem}>
                    <Link href={`/urunlerimiz/${(product.slug)}`} >
                      <img
                        className={styles.productItemImage}
                        src={product.kapak_fotografi}
                        alt={product.baslik}
                      />
                    </Link>
                    <Link href={`/urunlerimiz/${(product.slug)}`} >
                      <p className={styles.productItemTitle}>{product.baslik}</p>
                    </Link>
                    <p className={styles.productItemPrice}>{product.fiyat ? `${product.fiyat} TL` : ''}</p>
                </div>
                ))}
          
              </Slider>
          )}
      </div>
    </div>
  );
};

export default Vitrin;


