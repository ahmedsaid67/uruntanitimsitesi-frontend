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
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Error fetching tabs or products:', error);
        setActiveTab(null);
        setIsLoading(false)
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

  



  const animateScroll = (start, end, duration) => {
    const startTime = performance.now();

    const step = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1); // 0 ile 1 arasında bir değer

        const scrollValue = start + (end - start) * progress;
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = scrollValue;
        }

        if (progress < 1) {
            requestAnimationFrame(step);
        }
    };

    requestAnimationFrame(step);
  };

  const checkAndScrollTabIntoView = (newValue) => {
      const activeTabElement = document.querySelector(`.${styles.kategoriItemTitle}[data-slug='${newValue.slug}']`);

      if (activeTabElement && variant === 'scrollable') {
          const tabStartX = activeTabElement.getBoundingClientRect().x;
          const tabEndX = tabStartX + activeTabElement.offsetWidth;
          const containerWidth = window.innerWidth;
          const tabPadding = 8; // Padding değeri
          const tabMargin = 16; // Margin değeri

          if (tabStartX < 0 || tabEndX > containerWidth) {
              let scrollAmount = 0;
              if (tabStartX < 0) {
                  scrollAmount = tabStartX - tabPadding - tabMargin;
              } else if (tabEndX > containerWidth) {
                  scrollAmount = tabEndX - containerWidth + tabPadding + tabMargin;
              }

              if (scrollContainerRef.current) {
                  const currentScroll = scrollContainerRef.current.scrollLeft;
                  animateScroll(currentScroll, currentScroll + scrollAmount, 500); // 500ms animasyon
              }
          }
      }
  };




  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    setActiveTabAndFetchProducts(newValue.id);
    checkAndScrollTabIntoView(newValue)
  };

  

  useEffect(() => {
    const calculateTabWidths = () => {
      if (tabs.length > 0 && scrollContainerRef.current) {
        const containerWidth = window.innerWidth - 16;  // -32 sebebi sağdan soldan margın farkı
        const kategoriItems = scrollContainerRef.current.querySelectorAll(`.${styles.kategoriItemTitle}`);

        let totalTabsWidth = 0;
        kategoriItems.forEach((item) => {
          totalTabsWidth += item.offsetWidth + 8;
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
      <div className={variant === 'scrollable' ? styles.horizontalContainer : styles.horizontalContainerFullWidth}>
        <div className={variant === 'scrollable' ? styles.scrollable : styles.fullWidht} ref={scrollContainerRef}>
          {tabs.map((kategori, index) => (
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
                  
                }}
              >
                {kategori.baslik}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div className={styles.productContainer}>
        {isLoading ? (
          <div className={styles.loader}>
              <CircularProgress style={{ color: 'black' }}/>
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


