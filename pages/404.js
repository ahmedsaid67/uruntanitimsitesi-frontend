// pages/404.js
import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/404.module.css';

const Custom404 = () => {
  return (
    <>
      <Head>
        <title>Sayfa Bulunamadı</title>
      </Head>
      <div className={styles.container}>
        <h1 className={styles.title}>404 - Sayfa Bulunamadı</h1>
        <p className={styles.message}>Aradığınız sayfa bulunamadı. Lütfen başka bir sayfa aramayı deneyin.</p>
        <Link href="/" className={styles.homeLink}>
          Ana Sayfaya Dön
        </Link>
      </div>
    </>
  );
};

export default Custom404;
