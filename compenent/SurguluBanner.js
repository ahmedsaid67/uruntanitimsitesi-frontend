import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import Link from 'next/link';
import { API_ROUTES } from '../utils/constants';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import styles from '../styles/SurguluBanner.module.css';

const NextArrow = ({ onClick, show }) => (
  <div
    className={`${styles.rightArrow} ${show ? styles.show : ''}`}
    onClick={onClick}
  >
    <FaArrowRight />
  </div>
);

const PrevArrow = ({ onClick, show }) => (
  <div
    className={`${styles.leftArrow} ${show ? styles.show : ''}`}
    onClick={onClick}
  >
    <FaArrowLeft/>
  </div>
);

const SurguluBanner = () => {
  const [slides, setSlides] = useState([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0); // State to track active dot index

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
  
    handleResize();
    window.addEventListener('resize', handleResize);
  
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          isMobile ? API_ROUTES.SLIDERS_ACTIVE_MOBILE : API_ROUTES.SLIDERS_ACTIVE_MASAUSTU
        );
        const sortedSlides = response.data.sort((a, b) => a.order - b.order);
        setSlides(sortedSlides);
        await preloadImages(sortedSlides);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (isMobile !== null) {
      fetchData();
    }
  }, [isMobile]);

  const preloadImages = async (slides) => {
    const promises = slides.map((slide) =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.src = slide.img;
        img.onload = resolve;
        img.onerror = reject;
      })
    );
    await Promise.all(promises);
    setImagesLoaded(true);
  };

  const sliderRef = useRef(null);
  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      const interval = setInterval(() => {
        slider.slickNext();
      }, 5000); // Her 5 saniyede bir slaytı ileri götür

      return () => clearInterval(interval);
    }
  }, [slides]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000, // 5 saniye
    nextArrow: <NextArrow show={imagesLoaded} />,
    prevArrow: <PrevArrow show={imagesLoaded} />,
  };

  return (
    <div>
      {slides.length === 0 ? (
        <div className={styles.placeholder}></div>
      ) : (
        <div className={styles.sliderContainer}>
          <Slider ref={sliderRef} {...settings}>
            {slides.map((slide, index) => (
              <div key={index}>
                <Link href={slide.url}>
                  <img src={slide.img} alt={`Slide ${index + 1}`} />
                </Link>
              </div>
            ))}
          </Slider>
        </div>
      )}
    </div>
  );
};

export default SurguluBanner;

