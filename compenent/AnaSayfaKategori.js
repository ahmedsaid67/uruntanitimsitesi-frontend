import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/AnaSayfaKategori.module.css';
import Link from 'next/link';
import { style } from '@mui/system';
import { API_ROUTES } from '@/utils/constants';

const AnaSayfaKategori = () => {
  const [kategoriler, setKategoriler] = useState([]);

  useEffect(() => {
    axios.get(API_ROUTES.URUN_KATEGORI_ACTIVE)
      .then(response => {
        setKategoriler(response.data);
      })
      .catch(error => {
        console.error('Kategori yüklenirken bir hata oluştu:', error);
      });
  }, []);



  return (
    <div>
      {kategoriler.length === 0 ? (
        <div className={styles.placeholder}></div>
      ) : (
          <div className={styles.kategoriContainer}>
            <div className={styles.kategoriBaslik}>Kategoriler</div>
            <div className={styles.kategoriListesi}>
              {kategoriler.map((kategori, index) => (
                <Link 
                  href={`/urunlerimiz?tab=${kategori.slug}`}
                  key={kategori.id}
                  className={`${styles.kategoriItem} ${
                    index === 0 && kategoriler.length % 2 !== 0 ? styles.kategoriItemFull : ''
                  }`}
                >
                  <img
                    src={kategori.kapak_fotografi}
                    alt={kategori.baslik}
                    className={styles.kategoriGorsel}
                  />
                </Link>
              ))}
            </div>
          </div>
      )}
    </div>
  );
};

export default AnaSayfaKategori;








