import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import CircularProgress from '@mui/material/CircularProgress';
import styles from "../[slug]/urun.module.css";
import { API_ROUTES } from '@/utils/constants';
import Image from 'next/image';
import PopupWithZoom from '@/compenent/PopupWithZoom';
import Slider from 'react-slick';



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
}

const Urun = () => {

  
  const router = useRouter();
  const { slug } = router.query;
  const [data, setData] = useState(null);
  const [getImg, setImage] = useState([]);
  const [getMainImage, setMainImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mainImagesRef = useRef(null);

  const [showPopup, setShowPopup] = useState(false);

  const [activeDot, setActiveDot] = useState(null);
  const [activeImage, setActiveImage] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  
  const [isSliding, setIsSliding] = useState(false);
  const [scrollAmount, setScrollAmount] = useState(1); // Dinamik kaydırma miktarını tutacak state
  const sliderRef = useRef(null);
  const startYRef = useRef(0); // Kaydırma başlangıç pozisyonunu tutacak ref


  

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


  const settings = {
    vertical: true,
    verticalSwiping: true,
    infinite: false,
    arrows: false,
    slidesToShow: 5, // Aynı anda kaç öğe göstermek istediğinizi belirtin
    slidesToScroll: scrollAmount, // Dinamik kaydırma miktarını kullanın
    beforeChange: handleBeforeChange,
    afterChange: handleAfterChange,
  
  };

  
 
  useEffect(() => {
    if (!slug) return;

    const lastDashIndex = slug.lastIndexOf('-');
    const id = slug.substring(lastDashIndex + 1);

    const loadData = async () => {
      setLoading(true);
      try {
        const result = await getDataById(id);
        const imgResult = await getImageById(id);
        setData(result);
        setImage(imgResult);
        setMainImage(result.kapak_fotografi);
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
    console.log("asd")
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



{/* loading control */}
  if (loading) {
    return <div className={styles.loader}><CircularProgress /></div>;
  }

  if (error) {
    return <div className={styles.errorMessage}>{error}</div>;
  }

  if (!data) {
    return <div className={styles.noDataMessage}>Ürün bulunamadı.</div>;
  }

  return (
    <div>

        <div className={styles.container}>

        <div className={styles.imgContainer}>
          <Slider {...settings}
            className={styles.altImages}
            ref={sliderRef} 
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            vertical // Make sure to add this prop for vertical scrolling
          >
            {getImg.map((img, index) => (
             
                <Image key={index} src={img.image} alt=""
                className={`${styles.altImage} ${activeImage === img.id ? styles.active : ''}`}
                width={800} height={1200} 
                onClick={(e) => {
                  e.preventDefault();
                  if (!isSliding) {
                    scrollToImage(img.id);
                  }

                }}
                
                />
            ))}
          
          </Slider>
          
          <div className={styles.mainImages} ref={mainImagesRef}>
            {getImg.map((img, index) => (
                  
                <Image key={index} src={img.image} alt={img.id}  id={img.id}
                className={styles.mainImage}
                width={600} height={900}
                onClick={() => handleImageClick(img.image, index)}
                />
              ))}

            <div className={styles.rowDotContainer}>
                    {getImg.map((img, index) => (
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
                    
                  </div>
                      
          </div>
        
        </div>

        
        
        <div className={styles.detailContainer}>
          <h2 className={styles.detailTextStudio}>ASD Studio</h2>
          <h3 className={styles.detailText}>{data.baslik}</h3>
          <h4 className={styles.detailPrice}>{data.fiyat}</h4>
          {/* eğer ticaret sitesi ise */}

            
          {/* empty detail */}
          <>
          <p className={styles.detailText}>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsa et, possimus hic voluptatibus id, facere, exercitationem velit necessitatibus quisquam doloribus laboriosam autem nobis vero! Temporibus debitis expedita enim eos aperiam!</p>
          <p className={styles.detailText}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Et ducimus quibusdam mollitia doloribus repellat fugiat error, architecto dolor quaerat? Eos, sapiente corporis. Illum quibusdam inventore quis quia obcaecati dicta magni?</p>
          <p className={styles.detailText}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem labore aperiam perspiciatis, numquam nihil quam vero, cum incidunt voluptatibus, sunt pariatur sapiente qui nulla. Minus non maxime voluptatem vero labore!</p>
              
          </>
              
         
        </div>

        
      </div>
     
    
    {/* popup */}
    
    <PopupWithZoom
        showPopup={showPopup}
        handleClosePopup={handleClosePopup}
        handlePopupClick={handlePopupClick}
        getMainImage={getMainImage}
        imageSet={getImg}
        currentIndex={currentIndex} // Pass currentIndex to PopupWithZoom
      />

    
    </div>
  );
};

export default Urun;
