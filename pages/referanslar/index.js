import React, { useEffect, useState } from "react";
import styles from "./referans.module.css";
import { API_ROUTES } from '@/utils/constants';
import axios from 'axios';
import Link from "next/link";

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

  useEffect(() => {
    // Component yüklendiğinde referansları al
    const fetchReferences = async () => {
      try {
        const data = await getReferences();
        setReferences(data); // Veriyi state'e kaydet
        console.log(data);
      } catch (error) {
        console.error("Referanslar alınırken bir hata oluştu:", error);
      }
    };

    fetchReferences(); // fetchReferences fonksiyonunu çağırın

  }, []); // useEffect'in sadece bir kez çalışması için boş bağımlılık dizisi

  return (
    <div className={styles.container}>
      {references.map((ref, index) => (
        <Link href={ref.url} key={ref.id}>
        <div key={index} className={styles.imgCont}>
          <img src={ref.img} alt={ref.name} width={300} height={300} key={ref.id} className={styles.box}/>
          <p>{ref.name}</p>
        </div>
        </Link>
      ))}
    </div>
  );
};

export default Referans;
