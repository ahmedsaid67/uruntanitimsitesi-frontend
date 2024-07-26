import styles from "./hakkimizda.module.css";

import axios from 'axios';
import { API_ROUTES } from '@/utils/constants';
import React, { useState, useEffect } from 'react';
import { CircularProgress } from "@mui/material";
import BaslikGorsel from "@/compenent/BaslikGorsel";
import Head from "next/head";

const Hakkimizda = () => {
  const [content, setContent] = useState('');
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [id, setId] = useState(null);

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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (isLoading) {
    return (

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  if (hasError) {
    return (
      <Container>
        <Alert severity="error">
          Menü öğeleri alınırken bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.
        </Alert>
      </Container>
    );
  }

  return (
    <>
    <Head>
        <title>Flexsoft | Hakkımızda</title>
        <meta name="description" content="Flexsoft hakkında bilgi. E-ticaret ve yazılım hizmetleri sunan bir firma." />
        <meta name="keywords" content="Flexsoft, hakkımızda, e-ticaret, yazılım, firma,,site satın al,web site satın al,hazır site satın al,web site kurma,web site tasarımı,butik web site,butik web site satın al,mağaza web site satın al,web site fiyatları" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Flexsoft | Hakkımızda" />
        <meta property="og:description" content="Flexsoft hakkında bilgi. E-ticaret ve yazılım hizmetleri sunan bir firma." />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    <BaslikGorsel slug="hakkimizda"/>
    <div className={styles.container}>
      <div className={styles.detail}>
        <h2>Hakkımızda</h2>
        {/* HTML içeriği güvenli bir şekilde render et */}
        <div className={styles.content} dangerouslySetInnerHTML={{ __html: content }}></div>
      </div>
    </div>
  </>
  );
};


export default Hakkimizda;
