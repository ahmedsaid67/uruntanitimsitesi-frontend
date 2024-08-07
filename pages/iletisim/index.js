import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ROUTES } from '@/utils/constants';
import styles from './iletisim.module.css';
import { CircularProgress, Container, Alert } from '@mui/material';
import BaslikGorsel from "@/compenent/BaslikGorsel";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faLinkedin,
  faYoutube,
  faTiktok
} from '@fortawesome/free-brands-svg-icons'; 
import Head from 'next/head';

const getIcon = (url) => {
  if (url.includes('x.com')) return faTwitter;
  if (url.includes('instagram.com')) return faInstagram;
  if (url.includes('facebook.com')) return faFacebook;
  if (url.includes('linkedin.com')) return faLinkedin;
  if (url.includes('youtube.com')) return faYoutube;
  if (url.includes('tiktok.com')) return faTiktok;
  return null;
};

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
      const response = await axios.get(API_ROUTES.MEDYA_DETAIL);
      const result = response.data;
      const socialMediaData = [];

      if (result.twitter) socialMediaData.push({ id: 'twitter', url: result.twitter });
      if (result.instagram) socialMediaData.push({ id: 'instagram', url: result.instagram });
      if (result.facebook) socialMediaData.push({ id: 'facebook', url: result.facebook });
      if (result.youtube) socialMediaData.push({ id: 'youtube', url: result.youtube });
      if (result.linkedin) socialMediaData.push({ id: 'linkedin', url: result.linkedin });
      if (result.tiktok) socialMediaData.push({ id: 'tiktok', url: result.tiktok });

      setSocialMedia(socialMediaData); // Verileri state'e kaydet
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
          Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.
        </Alert>
      </Container>
    );
  }

  return (
    <div>
      <Head>
        <title>Flexsoft | İletişim</title>
        <meta name="description" content="Flexsoft, bir demo e-ticaret ve yazılım şirketidir. Şu anda İstanbul, Eyüpsultan'da bulunmaktadır." />
        <meta name="keywords" content="Flexsoft, iletişim, e-ticaret, yazılım, Eyüpsultan, Şişli,Gaziosmanpaşa,Bayrampaşa,Kağıthane,Sultangazi,Arnavutköy,İstanbul,,site satın al,web site satın al,hazır site satın al,web site kurma,web site tasarımı,butik web site,butik web site satın al,mağaza web site satın al,web site fiyatları" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Flexsoft | İletişim" />
        <meta property="og:description" content="Flexsoft, bir demo e-ticaret ve yazılım şirketidir. Şu anda İstanbul, Eyüpsultan'da bulunmaktadır." />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BaslikGorsel slug="iletisim" />

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
            {socialMedia.length === 0 && <p>Veri bulunamadı.</p>}
            {socialMedia.map((media) => (
              <a key={media.id} href={media.url} target="_blank" rel="noopener noreferrer" className={styles.iconLink}>
                <FontAwesomeIcon icon={getIcon(media.url)} className={styles.icon} />
              </a>
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
