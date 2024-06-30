import styles from '../styles/AltBar.module.css';
import React from 'react';
import Link from 'next/link';
import { FaHome, FaBox, FaAddressBook , FaEnvelope } from 'react-icons/fa';

const AltBar = () => {
  return (
    <div className={styles.container}>
      <Link href="/" passHref>
        <div className={styles.item}>
          <FaHome className={styles.icon} />
          <span>Ana Sayfa</span>
        </div>
      </Link>
      <Link href="/urunlerimiz" passHref>
        <div className={styles.item}>
          <FaBox className={styles.icon} />
          <span>Ürünlerimiz</span>
        </div>
      </Link>
      <Link href="/referanslar" passHref>
        <div className={styles.item}>
          <FaAddressBook  className={styles.icon} />
          <span>Referanslar</span>
        </div>
      </Link>
      <Link href="/iletisim" passHref>
        <div className={styles.item}>
          <FaEnvelope className={styles.icon} />
          <span>İletişim</span>
        </div>
      </Link>
    </div>
  );
};

export default AltBar;
