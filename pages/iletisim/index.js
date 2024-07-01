import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ROUTES } from '@/utils/constants';
import styles from './iletisim.module.css';
import { CircularProgress } from '@mui/material';

const Iletisim = () => {
  const [email, setEmail] = useState('');
  const [socialMedia, setSocialMedia] = useState([]);
  const [address, setAddress] = useState('');
  const [phones, setPhones] = useState(['', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Veriyi API'den al
  const getData = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await axios.get(API_ROUTES.ILETISIM.replace("id/", ""));
      const result = response.data.results[0]; // İlk sonucu al
      if (result) {
        const { email, phone1, phone2, address } = result;
        setEmail(email || '');
        setPhones([phone1 || '', phone2 || '']);
        setAddress(address || '');
      }
    } catch (error) {
      setHasError(true);
      console.error('Veri çekme hatası:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSocialData = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await axios.get(API_ROUTES.SOSYAL_MEDYA);
      setSocialMedia(response.data.results); // Verileri state'e kaydet
    } catch (error) {
      setHasError(true);
      console.error('Veri çekme hatası:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
    getSocialData();
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
    <div>
      <h2>İletişim</h2>

      <div className={styles.mainContainer}>
        <div className={styles.detail}>
          <h2>E-mail</h2>
          <p>{email || 'Veri bulunamadı'}</p>
        </div>
        <div className={styles.detail}>
          <h2>Adres</h2>
          <p>{address || 'Veri bulunamadı'}</p>
        </div>
        <div className={styles.detail}>
          <h2>Telefon</h2>
          {phones.filter(phone => phone).length > 0 ? (
            phones.filter(phone => phone).map((phone, index) => (
              <p key={index}>{phone}</p>
            ))
          ) : (
            <p>Veri bulunamadı</p>
          )}
        </div>
        <div className={styles.detail}>
        <h2>Sosyal Medya</h2>
        <div className={styles.socialMedia}>
          {isLoading && <p>Yükleniyor...</p>}
          {hasError && <p>Bir hata oluştu.</p>}
          {!isLoading && !hasError && socialMedia.length === 0 && <p>Veri bulunamadı.</p>}
          {socialMedia.map((media) => (
            media.durum ? ( // Sadece aktif olan sosyal medya hesaplarını göster
              <a key={media.id} href={media.url} target="_blank" rel="noopener noreferrer">
                <img src={media.img} alt={media.name} className={styles.icon} />
              </a>
            ) : null
          ))}
        </div>
      </div>
      </div>

      <div className={styles.map}>
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1504.250113643521!2d28.9210027661942!3d41.05805709525544!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e1d1224d96a7119%3A0x8cbe1c9940dac826!2sGaziosmanpa%C5%9Fa%20Monavet%20Veteriner%20Klini%C4%9Fi!5e0!3m2!1str!2str!4v1719593685137!5m2!1str!2str" 
          width="600" 
          height="450" 
          style={{ border: 0 }} 
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default Iletisim;
