import React, { useState, useEffect, useRef  } from 'react';
import { Pagination,PaginationItem } from '@mui/material';
import styles from '../../styles/Urunlerimiz.module.css';
import axios from 'axios';
import {API_ROUTES} from "../../utils/constants"
import CircularProgress from '@mui/material/CircularProgress'; 
import Link from 'next/link';
import Head from 'next/head';
import { FaChevronRight, FaChevronLeft} from 'react-icons/fa';
import { useSearchParams, useRouter } from 'next/navigation';



function Urunlerimiz() {
  const [kategoriler, setKategoriler] = useState([]);
  const [activeTab, setActiveTab] = useState({baslik:"",slug:""});
  const [prodcuts, setProducts] = useState([]);

  const router = useRouter();

  const [categoriesError, setCategoriesError] = useState(null)
  const [categoriesLoading,setCategoriesLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(0);

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Yükleme durumu için state



  const kategoriBasliklari = kategoriler.map(category => category.baslik).join(', ');

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [buttonStatus,setButtonStatus] = useState(false)
  const containerRef = useRef(null);
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get("page")) || 1
  


  // Fetch categories and set loading state
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_ROUTES.URUN_KATEGORI_ACTIVE);
        const res = response.data;
        setKategoriler(res);

        
        if(res.length>0){
          handleActiveCategory(res);
        }else{
          setIsLoading(false)
        }
        setCategoriesLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        router.push('/hata-sayfasi');
      }
    
    };

    if (kategoriler.length>0){
      handleActiveCategory(kategoriler)
    }else{
      fetchData();
    }
  }, [searchParams]);


  const handleActiveCategory = (categories) => {
    const pathSlug = searchParams.get('tab'); // Get the 'tab' query parameter
    const fullUrl = `${window.location.pathname}${window.location.search}`;

    if(pathSlug || fullUrl==="/urunlerimiz"){
      let activeCat = categories.find((category) => category.slug === pathSlug);
      const page = parseInt(searchParams.get("page")) || 1

      if(!activeCat && fullUrl==="/urunlerimiz"){
        activeCat = categories[0]
      }else if (!activeCat){
        router.push('/404');
        return;
      }
      
      setActiveTab({baslik:activeCat.baslik,slug:activeCat.slug});
      fetchMedications(activeCat.slug,page);
    }
  };



const fetchMedications = async (kategoriSlug,page) => {
      setIsLoading(true); // Set medications loading state to true
      try {

        const response = await axios.get(API_ROUTES.URUNLER_KATEGORI_FILTER.replace("seciliKategori", kategoriSlug).replace("currentPage",page))
        // console.log(response.data.results)
        

        setTotalPages(Math.ceil(response.data.count / 20));
        setProducts(response.data.results);
      } catch (error) {
        console.error('Error fetching medications:', error);
        if (error.response && error.response.data.detail === "Invalid page.") {
          // Redirect to the 404 page if invalid page error is encountered
          router.push('/404');
        }
        router.push("/heta-sayfasi");
      } finally {
        setIsLoading(false); // Set medications loading state to false
      }
    };




  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 3);
    }
  };


  const smoothScroll = (start, end, duration) => {
    const change = end - start;
    const startTime = performance.now();
  
    const animateScroll = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1); // 0 ile 1 arasında bir değer
      const easeInOutQuad = progress < 0.5 
        ? 2 * progress * progress 
        : -1 + (4 - 2 * progress) * progress; // Yumuşak animasyon eğrisi
  
      const scrollValue = start + change * easeInOutQuad;
      containerRef.current.scrollLeft = scrollValue;
  
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };
  
    requestAnimationFrame(animateScroll);
  };
  

  const handleScrollLeft = () => {
    if (containerRef.current) {
      const { scrollLeft, clientWidth } = containerRef.current;
      const scrollAmount = clientWidth * 0.8;
      const targetScroll = Math.max(scrollLeft - scrollAmount, 0);
  
      smoothScroll(scrollLeft, targetScroll, 500); // 500ms'lik animasyon
    }
  };
  
  const handleScrollRight = () => {
    if (containerRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = containerRef.current;
      const scrollAmount = clientWidth * 0.8;
      const maxScrollLeft = scrollWidth - clientWidth;
      const targetScroll = Math.min(scrollLeft + scrollAmount, maxScrollLeft);
  
      smoothScroll(scrollLeft, targetScroll, 500); // 500ms'lik animasyon
    }
  };

  const handleCategoryClick = (category) => {

    setActiveTab({baslik:category.baslik,slug:category.slug})

    
  
    const container = containerRef.current;
    const categoryElement = document.getElementById(`category-${category.slug}`);
    const leftButton = document.querySelector(`.${styles.scrollButtonLeft}`);
    const rightButton = document.querySelector(`.${styles.scrollButtonRight}`);
  
    if (container && categoryElement) {
      const containerRect = container.getBoundingClientRect();
      const categoryRect = categoryElement.getBoundingClientRect();
  
      // Buton genişliklerini al
      const leftButtonWidth = leftButton ? leftButton.getBoundingClientRect().width : 0;
      const rightButtonWidth = rightButton ? rightButton.getBoundingClientRect().width : 0;
  
      if (
        categoryRect.left >= containerRect.left &&
        categoryRect.right <= containerRect.right
      ) {
        return; // Zaten görünüyorsa, kaydırmaya gerek yok
      }
  
      const spacing = 32; // Ek boşluk
      let scrollAmount;
  
      if (categoryRect.left < containerRect.left) {
        // Sol tarafa kaydır
        scrollAmount = categoryRect.left - containerRect.left - spacing - leftButtonWidth;
      } else {
        // Sağ tarafa kaydır
        scrollAmount = categoryRect.right - containerRect.right + spacing + rightButtonWidth;
      }
  
      // Mevcut pozisyon ve hedef pozisyon
      const start = container.scrollLeft;
      const targetScroll = start + scrollAmount;
  
      // Animasyonu uygula
      smoothScroll(start, targetScroll, 500); // 500ms'lik animasyon
    }
  };

  useEffect(()=>{

    if(activeTab.baslik){
      const category=activeTab

      const container = containerRef.current;
      const categoryElement = document.getElementById(`category-${category.slug}`);
      const leftButton = document.querySelector(`.${styles.scrollButtonLeft}`);
      const rightButton = document.querySelector(`.${styles.scrollButtonRight}`);
    
      if (container && categoryElement) {
        const containerRect = container.getBoundingClientRect();
        const categoryRect = categoryElement.getBoundingClientRect();
    
        // Buton genişliklerini al
        const leftButtonWidth = leftButton ? leftButton.getBoundingClientRect().width : 0;
        const rightButtonWidth = rightButton ? rightButton.getBoundingClientRect().width : 0;
    
        if (
          categoryRect.left >= containerRect.left &&
          categoryRect.right <= containerRect.right
        ) {
          return; // Zaten görünüyorsa, kaydırmaya gerek yok
        }
    
        const spacing = 32; // Ek boşluk
        let scrollAmount;
    
        if (categoryRect.left < containerRect.left) {
          // Sol tarafa kaydır
          scrollAmount = categoryRect.left - containerRect.left - spacing - leftButtonWidth;
        } else {
          // Sağ tarafa kaydır
          scrollAmount = categoryRect.right - containerRect.right + spacing + rightButtonWidth;
        }
    
        // Mevcut pozisyon ve hedef pozisyon
        const start = container.scrollLeft;
        const targetScroll = start + scrollAmount;
    
        // Animasyonu uygula
        smoothScroll(start, targetScroll, 500); // 500ms'lik animasyon
      }

    }

  },[containerRef.current])



  useEffect(()=>{

    const calculateTotalWidth = () => {
      if (containerRef.current) {
        const {clientWidth } = containerRef.current;
        // console.log("clientWidth:",clientWidth+29)
        const categories = containerRef.current.children; // Container'ın altındaki tüm elemanlar
        const total = Array.from(categories).reduce((acc, category) => {
            return acc + category.offsetWidth; // Her bir elemanın genişliğini topla
        }, 0);
        // console.log("total:",total)

        const spacing = (categories.length - 1) * 16;
        // console.log("spacing:",spacing)
        const adjustedTotal = total + spacing;

        // console.log("total (adjusted):", adjustedTotal);

        // Buton durumunu belirle
        setButtonStatus(adjustedTotal > clientWidth+29);
      
      }

    }

    calculateTotalWidth(); // İlk render'da genişliği hesapla

    // Ekran boyutu değişirse genişliği yeniden hesapla
    window.addEventListener("resize", calculateTotalWidth);
    return () => {
      window.removeEventListener("resize", calculateTotalWidth);
    };


  },[containerRef.current])

  
  

  return (
      <>
        <Head>
          <title>Ürünlerimiz | Flexsoft</title>
          <meta name="description" content={`Flexsoft, bir e-ticaret sitesidir ve yazılım hizmetleri vermektedir. Kategorilerimiz: ${kategoriBasliklari}.`} />
        </Head>


        {categoriesLoading ? (
        <div className={styles.loadingOverlay}>
          <CircularProgress sx={{ color: 'rgb(29,29,31)' }} />
        </div>
        ):(

          <div className={styles.container}>

            <div className={styles.siteMap}>
              <Link href="/">
                <div className={styles.mapText}>Ana Sayfa</div>
              </Link>
              <span className={styles.icon}>/</span>
              <Link href="/urunlerimiz">
                <div className={styles.mapText}>Ürünlerimiz</div>
              </Link>
              <span className={styles.icon}>/</span>
              <div className={`${styles.mapText} ${styles.activeText}`}>{activeTab.baslik}</div>
            </div>

            <div className={styles.baslikContainer}>
              <h1>{activeTab.baslik}</h1>
            </div>

            <div className={styles.categoryContainer}>
              <div className={styles.scrollContainer} ref={containerRef} onScroll={handleScroll}>
                { kategoriler.map((kategori, index) => (
                  <Link
                    key={kategori.id} // Add the key here for the Link component
                    href={`/urunlerimiz?tab=${kategori.slug}&page=1`}
                    passHref
                    onClick={() => handleCategoryClick(kategori)}
                  >
                    <div
                      id={`category-${kategori.slug}`}
                      className={
                        activeTab.slug === kategori.slug
                          ? styles.ItemActiveContainer
                          : styles.ItemContainer
                      }
                    >
                      <p>{kategori.baslik}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            {buttonStatus && (
              <div className={styles.directionContainer}>
                
                  <button
                    className={`${styles.buttonLeft} ${!canScrollLeft ? styles.disabled : ''}`}
                    onClick={canScrollLeft ? handleScrollLeft : undefined}
                    disabled={!canScrollLeft}
                  >
                    <FaChevronLeft className={styles.directionIcon} />
                  </button>
              

                  <button
                    className={`${styles.buttonRight} ${!canScrollRight ? styles.disabled : ''}`}
                    onClick={canScrollRight ? handleScrollRight : undefined}
                    disabled={!canScrollRight}
                  >
                    <FaChevronRight className={styles.directionIcon}/>
                  </button>
              </div>
            )}

           <div className={styles.altContainer}>

              {isLoading ? (
                <div className={styles.contextContainerAlternative}>
                  <CircularProgress sx={{ color: 'rgb(29,29,31)' }} />
                </div>
              ) : prodcuts.length === 0 ? ( // Ürün sayısı sıfırsa, içerik eklenmemiş mesajı
                <div className={styles.icerikYok}>
                  Henüz içerik eklenmemiştir.
                </div>
              ) : (
                <>
                  <div className={styles.productContainer}>
                    {prodcuts.map(product => (
                      <div key={product.id} className={styles.productItem}>
                        <Link href={`/urunlerimiz/${product.slug}`}>
                          <img
                            className={styles.productItemImage}
                            src={product.kapak_fotografi}
                            alt={product.baslik}
                          />
                        </Link>
                        <Link href={`/urunlerimiz/${product.slug}`}>
                          <p className={styles.productItemTitle}>{product.baslik}</p>
                        </Link>
                        <p className={styles.productItemPrice}>
                          {product.fiyat ? `${product.fiyat} TL` : ''}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  {prodcuts.length > 0 && (
                    <div className={styles.paginationContainer}>
                      <Pagination
                        count={totalPages} // Toplam sayfa sayısı
                        page={page} // Geçerli sayfa
                        color="primary"
                        sx={{
                          '.MuiPaginationItem-root': {
                            fontSize: '1rem',
                            fontWeight: 500,
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            backgroundColor: '#d6d6d6', // Aktif olmayan buton arka plan rengi (biraz daha koyu)
                            color: '#333', // Yazı rengi
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: '#bdbdbd', // Hover sırasında biraz daha koyu bir gri
                            },
                          },
                          '.Mui-selected': {
                            backgroundColor: 'rgb(29, 29, 31) !important', // Aktif sayfa arka plan rengi
                            color: '#fff', // Aktif sayfa yazı rengi
                            fontWeight: 'bold',
                            '&:hover': {
                              backgroundColor: 'rgb(29, 29, 31) !important', // Hover sırasında aynı renk
                              boxShadow: '0px 6px 8px rgba(0, 0, 0, 0.3)',
                            },
                          },
                        }}
                        renderItem={item => (
                          <Link
                            href={`/urunlerimiz?tab=${activeTab.slug}&page=${item.page}`}
                            passHref
                          >
                            <PaginationItem {...item} />
                          </Link>
                        )}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

    </>
  );
}

export default Urunlerimiz;
