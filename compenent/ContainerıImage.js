'use client'
import React, { useRef, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from '../pages/urunlerimiz/[slug]/urundetay.module.css';
import { FaRegArrowAltCircleDown, FaRegArrowAltCircleUp } from "react-icons/fa";


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

const ContainerıImage = ({getImage}) => {


      const mainImagesRef = useRef(null);
      const sliderRefMain = useRef(null);
    
      const [isSliding, setIsSliding] = useState(false);
      const sliderRef = useRef(null);
    
      const [activeImage, setActiveImage] = useState(null);

    


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
    





    const settings = {
        vertical: true,
        verticalSwiping: true,
        infinite: false,
        arrows: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        slidesToShow: 4.5, // Aynı anda kaç öğe göstermek istediğinizi belirtin
        beforeChange: handleBeforeChange,
        afterChange: handleAfterChange,
        responsive: [
          {
            breakpoint: 1200, // For screens 1200px and up
            settings: {
              slidesToShow: 4.5 // Adjusted to match the default setting
            }
          },
        ],
      };
    
      const settingsMain = {
        dots: false, // Noktalar her zaman aktif
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
              vertical: false, // Tablet ve mobilde yatay düzen
              verticalSwiping: false,
            },
          },
          {
            breakpoint: 576, // Mobil cihazlar için
            settings: {
              vertical: false, // Mobilde de yatay düzen
              verticalSwiping: false,
            },
          },
        ],
      };


  return (
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
  );
};

export default ContainerıImage;