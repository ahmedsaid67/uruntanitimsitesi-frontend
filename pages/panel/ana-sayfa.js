import React from 'react';
import styles from '../../styles/PanelAnaSayfa.module.css';

const App = () => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const currentDate = new Date().toLocaleDateString('tr-TR', options);

  return (
      <div className={styles.mainContainer}>
        <h1 className={styles.dateHeader}>{currentDate}</h1>
        <div className={styles.welcomeContainer}>
          <h1 className={styles.welcomeHeader}>Hoş geldiniz!</h1>
          <div className={styles.taskContainer}>
            <div className={styles.taskBox}>
              <h3>Ürün Ekleyin</h3>
              <button className={styles.button}>Ekle</button>
            </div>
            <div className={styles.taskBox}>
              <h3>Banner Ekleyin</h3>
              <button className={styles.button}>Ekle</button>
            </div>
            <div className={styles.taskBox}>
              <h3>Referans Ekleyin</h3>
              <button className={styles.button}>Ekle</button>
            </div>
        
          </div>
        </div>
        <div className={styles.statsContainer}>
          <div className={`${styles.statBox} ${styles.blue}`}>
            <h3>TL 0,00</h3>
            <p>Temmuz Cirosu</p>
          </div>
          <div className={`${styles.statBox} ${styles.red}`}>
            <h3>TL 0,00</h3>
            <p>Temmuz Masrafları</p>
          </div>
          <div className={`${styles.statBox} ${styles.green}`}>
            <h3>0,00</h3>
            <p>Stok Değeri</p>
          </div>
        </div>
      </div>
  );
};

export default App;


