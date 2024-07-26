import React, { useState, useEffect, useRef  } from 'react';
import { Pagination} from '@mui/material';
import TabPanel from '../../compenent/TabPanel'
import styles from '../../styles/Urunlerimiz.module.css';
import axios from 'axios';
import { useRouter } from 'next/router';
import {API_ROUTES} from "../../utils/constants"
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress'; 
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';
import BaslikGorsel from '@/compenent/BaslikGorsel';
import Head from 'next/head';


function Urunlerimiz() {
  const [kategoriler, setKategoriler] = useState([]);
  const [activeTab, setActiveTab] = useState('');
  const [prodcuts, setProducts] = useState([]);
  const [orientation, setOrientation] = useState('vertical');
  const router = useRouter();
  const [isScrolTab, setIsScrolTab] = useState(false);
  const [variant, setVariant] = useState('scrollable');

  const [categoriesError, setCategoriesError] = useState(null)
  const [categoriesLoading,setCategoriesLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(0);
  const currentPage = parseInt(router.query.page || '1', 10);

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Yükleme durumu için state

  const scrollContainerRef = useRef(null);
  
  const [isLeftArrowVisible, setIsLeftArrowVisible] = useState(false);
  const [isRightArrowVisible, setIsRightArrowVisible] = useState(false);
  
  const [isHorizontalContainerHovered, setIsHorizontalContainerHovered] = useState(false);

  const [slug,setSlug] = useState("")

  const kategoriBasliklari = kategoriler.map(category => category.baslik).join(', ');

  useEffect(() => {
    const fetchCategoriesAndValidateTab = async () => {
      if (!router.isReady) return;
  
      setCategoriesLoading(true);
      try {
        const response = await axios.get(API_ROUTES.URUN_KATEGORI_ACTIVE);
        const categories = response.data;
        setKategoriler(categories);
  
        const tabUrlFriendly = router.query.tab ? router.query.tab : null;
  
        const isValidTab = categories.some(category => category.slug === tabUrlFriendly);

  
        if (tabUrlFriendly && !isValidTab) {
          router.push('/hata-sayfasi');
          const fakeInitialTab = categories.length > 0 ? categories[0].slug : '';
          setActiveTab(fakeInitialTab);
        } else {
          const initialTab = tabUrlFriendly || categories[0]?.slug;
          setActiveTab(initialTab);
          
        }
  
        setCategoriesError(null);
      } catch (error) {
        console.error('Kategoriler yüklenirken hata:', error);
        setCategoriesError('Veriler yüklenirken beklenmeyen bir sorun oluştu. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setCategoriesLoading(false);
      }
    };
  
    fetchCategoriesAndValidateTab();
  }, [router.isReady]);




  const fetchBooks = async (kategoriSlug,page) => {
    setIsLoading(true)
    try {
      const productsResponse = await axios.get(API_ROUTES.URUNLER_KATEGORI_FILTER.replace("seciliKategori", kategoriSlug).replace("currentPage",page));
      setProducts(productsResponse.data.results);
      setTotalPages(Math.ceil(productsResponse.data.count / 10));
      setError(null);
    } catch (error) {
      console.error("Veri yükleme sırasında bir hata oluştu:", error);
      if (error.response && error.response.status === 404 && error.response.data.detail === "Invalid page.") {
        // 'Invalid page' detayını kontrol eden ve buna göre hata mesajı döndüren koşul
        setError('Geçersiz sayfa. Bu sayfa mevcut değil veya sayfa numarası hatalı. Lütfen sayfa numarasını kontrol edin.');
      } else {
        setError('Veriler yüklenirken beklenmeyen bir sorun oluştu. Lütfen daha sonra tekrar deneyin.');
      }
    }finally {
      setIsLoading(false); // Yükleme işlemi tamamlandığında veya hata oluştuğunda
    }
  };



  // Aktif tab veya kategoriler değiştiğinde personellerı fetch etme
  useEffect(() => {
    if (activeTab && kategoriler.length > 0) {
      const selectedKategori = kategoriler.find(k => k.slug === activeTab);
      if (selectedKategori) {
        fetchBooks(selectedKategori.slug,currentPage);
        setSlug(selectedKategori.slug)
      }
      
    }
  }, [kategoriler]);

  useEffect(() => {
    if (router.query.tab && kategoriler.length > 0) {
      const selectedKategori = kategoriler.find(k => k.slug === router.query.tab);
      if (selectedKategori) {
        fetchBooks(selectedKategori.slug,currentPage);
        setSlug(selectedKategori.slug)
      }
      
    }
  }, [kategoriler,currentPage]);



  useEffect(() => {
    if (router.query.tab && kategoriler.length > 0) {
      setActiveTab(router.query.tab)
      const selectedKategori = kategoriler.find(k => k.slug === router.query.tab);
      if (selectedKategori) {
        fetchBooks(selectedKategori.slug,currentPage);
        setSlug(selectedKategori.slug)
      }
    }else if (router && kategoriler.length > 0){
      
      const selectedKategori = kategoriler[0];
      const initialTab = selectedKategori?.slug;
      setActiveTab(initialTab);
      fetchBooks(selectedKategori.slug,currentPage);
      setSlug(selectedKategori.slug)
    }
  }, [router]);

  useEffect(() => {
    const checkAndScrollTabIntoView = () => {
        const activeTabElement = document.querySelector(`.${styles.kategoriItemTitle}[data-slug='${activeTab}']`);
  
        if (activeTabElement && orientation === 'horizontal') {
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
  
    checkAndScrollTabIntoView();
  }, [activeTab, orientation]);
  
  

  const handleTabChange = (newValue) => {
   

    router.push(`/urunlerimiz?tab=${newValue}`, undefined, { shallow: true });
};


  const handlePageChange = (event, value) => {
    router.push(`/urunlerimiz?tab=${activeTab}&page=${value}`);
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
      if (kategoriler.length > 0 && scrollContainerRef.current) {
        const containerWidth = window.innerWidth -16; 
        const kategoriItems = scrollContainerRef.current.querySelectorAll(`.${styles.kategoriItemTitle}`);

        let totalTabsWidth = 0;
        kategoriItems.forEach((item) => {
          totalTabsWidth += item.offsetWidth + 16;
        });

        if (totalTabsWidth -16 > containerWidth) {     //-17 sebebi gap sadece eleman arasına 1rem fark verıyor 6 eleman var ise 5 kere yanı ondan -1 gerekıyor
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
  }, [kategoriler]);


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
  }, [scrollContainerRef, kategoriler]);
  
  
  


  useEffect(() => {
    const handleResize = () => {
      setOrientation(window.innerWidth <= 1023 ? 'horizontal' : 'vertical');


      const checkIsScrollTab = () => typeof window !== "undefined" && window.innerWidth <= 1023;
  
      setIsScrolTab(checkIsScrollTab());
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);



  return (
      <>
      <Head>
        <title>Flexsoft | Ürünlerimiz</title>
        <meta name="description" content={`Flexsoft, bir e-ticaret sitesidir ve yazılım hizmetleri vermektedir. Kategorilerimiz: ${kategoriBasliklari}.`} />
        <meta name="keywords" content={`e-ticaret, yazılım, butik, giyim mağazaları,site satın al,web site satın al,hazır site satın al,web site kurma,web site tasarımı,butik web site,butik web site satın al,mağaza web site satın al,web site fiyatları, ${kategoriBasliklari}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Flexsoft | Ürünlerimiz" />
        <meta property="og:description" content={`Flexsoft, bir e-ticaret sitesidir ve yazılım hizmetleri vermektedir. Kategorilerimiz: ${kategoriBasliklari}.`} />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BaslikGorsel slug={slug}/>

      { categoriesLoading ? (
        <div className={styles.loaderMain}>
        <CircularProgress style={{ color: 'black' }}/> 
        </div>)
        : categoriesError ? (
        <div className={styles.errorMessage}>{categoriesError}</div>
      )
      : kategoriler.length > 0 ? (

        <>
        <BaslikGorsel slug={slug}/>

      <div className={styles.container}>

        

        <div className={styles.mainContainer}>
          
          <div className={styles.leftContainer}>
            <div className={styles.LeftBoxContainer}>
              <div className={styles.baslik}>Kategoriler</div>
              <div
                className={orientation === 'vertical' ? styles.verticalContainer : variant === 'scrollable' ? styles.horizontalContainer : styles.horizontalContainerFullWidth}
                onMouseEnter={() => {
                  if (orientation === 'horizontal') {
                    setIsHorizontalContainerHovered(true);
                  }
                }}
                onMouseLeave={() => {
                  if (orientation === 'horizontal') {
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
                <div className={orientation === 'vertical' ? null : variant === 'scrollable' ? styles.scrollable : styles.fullWidht} ref={scrollContainerRef}>
                  { kategoriler.map((kategori, index) => (
                    <div key={index}
                      className={orientation === 'horizontal' ? styles.horizontalCLick : null}
                      style={{ 
                        borderBottom: kategori.slug === activeTab && orientation !== 'vertical' ? '3px solid black' : 'none'
                      }}
                      onClick={orientation === 'horizontal' ? () => handleTabChange(kategori.slug) : null}
                    >
                      <span
                        className={orientation === 'horizontal' ? styles.kategoriItemTitleHorizantal : styles.kategoriItemTitle}
                        data-slug={kategori.slug} 
                        style={{ 
                          color: kategori.slug === activeTab ? 'black' : '#666',
                          fontWeight: kategori.slug === activeTab ? 'bold' : 'normal',
                        }}
                        onClick={orientation === 'vertical' ? () => handleTabChange(kategori.slug) : null}
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

          <div className={styles.rightContainer}>
            <div className={styles.verticalTabsContent}>
              {kategoriler.map(kategori => (
                <TabPanel key={kategori.id} value={activeTab} index={kategori.slug}>
                  {isLoading ? (
                      <div className={styles.loader}>
                        <CircularProgress style={{ color: 'black' }}/> {/* Yükleme göstergesi */}
                      </div>
                      ) : error ? (
                        <div className={styles.errorMessage}>{error}</div>
                      ) : prodcuts.length > 0 ? (
                      <div className={styles.productContainer}>
                        {prodcuts.map(product => (
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
                      </div>
                  ) : (
                    <div className={styles.noDataMessage}>Kayıtlı veri bulunmamaktadır.</div> // Veri yoksa bu mesaj gösterilir
                  )
                  
                  }
                  {!isLoading && !error && totalPages > 0 && (
                      <Stack spacing={2} alignItems="center" className={styles.paginationContainer}>
                        <Pagination
                          count={totalPages}
                          page={currentPage}
                          onChange={handlePageChange}
                          variant="outlined"
                          shape="rounded"
                          sx={{
                            '& .MuiPaginationItem-root': { color: 'inherit' },
                            '& .MuiPaginationItem-page.Mui-selected': {
                              backgroundColor: 'black',
                              color: '#fff',
                              '&:hover': {
                                backgroundColor: '#555',
                              },
                            },
                          }}
                        />
                      </Stack>
                    )}
                    
                </TabPanel>
              ))}
            </div>
          </div>
        </div>
      </div>
      </>
      ): (
        <div className={styles.infoMessage}>Kayıtlı Ürün Kategori verisi bulunmamaktadır.</div>)
      }
    </>
  );
}

export default Urunlerimiz;