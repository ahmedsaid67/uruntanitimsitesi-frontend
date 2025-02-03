import styles from "./hakkimizda.module.css";

import axios from 'axios';
import { API_ROUTES } from '@/utils/constants';
import React, { useState, useEffect } from 'react';
import { CircularProgress } from "@mui/material";
import Head from "next/head";
import Link from "next/link";
import {useRouter } from 'next/navigation';

const Hakkimizda = () => {
  const [content, setContent] = useState('');
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [id, setId] = useState(null);
  const router = useRouter();

  // Veriyi API'den al
  const getData = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await axios.get(API_ROUTES.HAKKIMIZDA.replace("id/", ""));
      const result = response.data.results[0]; // İlk sonucu al
      if (result) {
        const { content, id } = result;
        setData(result);
        setContent(content || '');
        setId(id); // Verinin id'sini sakla
      }
    } catch (error) {
      setHasError(true);
      console.error('Veri çekme hatası:', error);
      router.push('/hata-sayfasi');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);


  return (
    <>
    <Head>
        <title>Flexsoft | Hakkımızda</title>
        <meta name="description" content="Flexsoft hakkında bilgi. E-ticaret ve yazılım hizmetleri sunan bir firma." />
        <meta name="keywords" content="Flexsoft, hakkımızda, e-ticaret, yazılım, firma,,site satın al,web site satın al,hazır site satın al,web site kurma,web site tasarımı,butik web site,butik web site satın al,mağaza web site satın al,web site fiyatları" />
      </Head>

      {isLoading ? (
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
              <div className={`${styles.mapText} ${styles.activeText}`}>Hakkımızda</div>
            </div>
      
            <div className={styles.baslikContainer}>
              <h1>Hakkımızda</h1>
            </div>
      
            <div className={styles.content} dangerouslySetInnerHTML={{ __html: content }}>
              
            </div>
          </div>
      )}
  </>
  );
};


export default Hakkimizda;
