
import Head from 'next/head';
import styles from '../styles/404.module.css';

const Custom404 = () => {
  return (
    <>
      <Head>
        <title>Sayfa Bulunamadı</title>
      </Head>
      <div className={styles.container}>
        <h1 className={styles.title}>500 - Sever Hatası</h1>
        <p className={styles.message}>Server'ımız şuan hizmet veremiyor. Daha sonra tekrar deneyiniz.</p>
      </div>
    </>
  );
};

export default Custom404;