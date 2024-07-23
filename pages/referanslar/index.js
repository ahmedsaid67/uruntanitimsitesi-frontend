import React, { useEffect, useState } from "react";
import styles from "./referans.module.css";
import { API_ROUTES } from '@/utils/constants';
import axios from 'axios';
import Link from "next/link";
import BaslikGorsel from "../../compenent/BaslikGorsel";
import { CircularProgress } from "@mui/material";
import Head from "next/head";



const getReferences = async () => {
  try {
    const referencesResponse = await axios.get(API_ROUTES.REFERENCES);
    return referencesResponse.data.results; // API'den dönen JSON verisini döndürür
  } catch (error) {
    if (error.response) {
      // Sunucu tarafından bir hata dönerse
      console.error("Sunucudan hata döndü:", error.response.data);
    } else if (error.request) {
      // İstek yapıldı ama cevap alınamadıysa
      console.error("Cevap alınamadı:", error.request);
    } else {
      // İstek yaparken bir hata oluştu
      console.error("İstek sırasında bir hata oluştu:", error.message);
    }
    throw error; // Hatanın yeniden fırlatılması
  }
};

const Referans = () => {
  const [references, setReferences] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const referans = references.map(referance => referance.name).join(', ');
  useEffect(() => {
    // Component yüklendiğinde referansları al
    const fetchReferences = async () => {
      setIsLoading(true);
      setHasError(false);
      try {
        
        const data = await getReferences();
        setReferences(data); // Veriyi state'e kaydet
      } catch (error) {
        console.error("Referanslar alınırken bir hata oluştu:", error);
        setHasError(true);
        console.error('Veri çekme hatası:', error);
      }
      finally{
        setIsLoading(false);
      }
    };

    fetchReferences(); // fetchReferences fonksiyonunu çağırın

  }, []); // useEffect'in sadece bir kez çalışması için boş bağımlılık dizisi

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
        <title>Flexsoft | Referanslar</title>
        <meta name="description" content={`Flexsoft, bir e-ticaret sitesidir ve yazılım hizmetleri vermektedir. Butik ve giyim mağazalarına yönelik referanslarımız: ${referans}.`} />
        <meta name="keywords" content={`e-ticaret, yazılım, butik, giyim mağazaları, referanslar,site satın al,web site satın al,hazır site satın al,web site kurma,web site tasarımı,butik web site,butik web site satın al,mağaza web site satın al,web site fiyatları ${referans}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Flexsoft | Referanslar" />
        <meta property="og:description" content={`Flexsoft, bir e-ticaret sitesidir ve yazılım hizmetleri vermektedir. Butik ve giyim mağazalarına yönelik referanslarımız: ${referans}.`} />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

    <BaslikGorsel slug="referanslar"/>


    <div className={styles.container}>
      {references.map((ref, index) => (
        <Link href={ref.url} key={ref.id} target="blank">
        <div key={index} className={styles.imgCont}>
          <img src={ref.img} alt={ref.name} width={300} height={300} key={ref.id} className={styles.box}/>
          <p>{ref.name}</p>
        </div>
        </Link>
      ))}
    </div>

    </>
  );
};

export default Referans;
