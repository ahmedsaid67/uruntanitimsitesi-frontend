import React, { useState, useEffect } from 'react';
import styles from "../pages/urunlerimiz/[slug]/urundetay.module.css";
import Image from 'next/image';

const PopupWithZoom = ({ showPopup, handlePopupClick, handleClosePopup, getMainImage, imageSet, currentIndex }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(currentIndex);

  useEffect(() => {
    setCurrentImageIndex(currentIndex);
  }, [currentIndex]);

  const handleNextImage = () => {
    if (currentImageIndex < imageSet.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowRight' || event.key=== 'd') {
        handleNextImage();
      } else if (event.key === 'ArrowLeft'|| event.key=== 'a') {
        handlePrevImage();
      }
      else if(event.key === "Escape"){
        handleClosePopup();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentImageIndex, imageSet.length]);

  return (
    <>
      {showPopup && (
        <div className={styles.popup} onClick={handlePopupClick}>
          <div className={styles.popupContent}>
            <span className={styles.closeButton} onClick={handleClosePopup}>
              &times;
            </span>
            <Image
              src={imageSet[currentImageIndex].image}
              alt="Main Image"
              width={800}
              height={1200}
              className={styles.popImage}
            />
            {currentImageIndex > 0 && (
              <button className={styles.leftArrow} onClick={handlePrevImage}>
                &#10094;
              </button>
            )}
            {currentImageIndex < imageSet.length - 1 && (
              <button className={styles.rightArrow} onClick={handleNextImage}>
                &#10095;
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PopupWithZoom;
