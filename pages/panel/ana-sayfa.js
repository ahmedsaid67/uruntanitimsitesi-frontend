import React ,{useEffect,useState} from 'react';
import styles from '../../styles/PanelAnaSayfa.module.css';
import Link from 'next/link';
import { FaPlus, FaBox, FaRegImage, FaAddressBook } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { Container,Alert,CircularProgress } from '@mui/material';
import axios from 'axios';
import { API_ROUTES } from '@/utils/constants';

const App = () => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const currentDate = new Date().toLocaleDateString('tr-TR', options);

  const user = useSelector((state) => state.user);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [res,setRes] = useState(null)
  const [apiError, setApiError] = useState(false);

  const getData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_ROUTES.ADET);
      setRes(response.data);
      console.log(response.data)
    } catch (error) {
      setApiError(true);
      console.log("hata:",error)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user.id) {
      router.push({
        pathname: "/login",
        query: { from: router.pathname },
      });
    } else {
      getData();
    }
  }, [user]);


  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' ,width:'100%'}}>
        <CircularProgress />
      </div>
    );
  }

  if (apiError) {
    return (
      <Container>
        <Alert severity="error">
          Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.
        </Alert>
      </Container>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.date}>{currentDate}</h1>
      </header>
      <main className={styles.main}>
        <section className={styles.welcomeSection}>
          <h1 className={styles.welcomeTitle}>Hoş geldiniz!</h1>
          <div className={styles.taskGrid}>
            <div className={styles.taskCard}>
              <FaBox className={styles.icon} />
              <h3>Ürün Ekleyin</h3>
              <Link href="/panel/urunler/urunler">
                <button className={styles.button}><FaPlus /> Ekle</button>
              </Link>
            </div>
            <div className={styles.taskCard}>
              <FaRegImage className={styles.icon} />
              <h3>Banner Ekleyin</h3>
              <Link href="/panel/sliders">
                <button className={styles.button}><FaPlus /> Ekle</button>
              </Link>
            </div>
            <div className={styles.taskCard}>
              <FaAddressBook className={styles.icon} />
              <h3>Referans Ekleyin</h3>
              <Link href="/panel/references">
                <button className={styles.button}><FaPlus /> Ekle</button>
              </Link>
            </div>
          </div>
        </section>
        <section className={styles.statsSection}>
          <div className={`${styles.statCard} ${styles.statCard1}`}>
            <h3>{res?.urun_adedi}</h3>
            <p>Ürün Adedi</p>
          </div>
          <div className={`${styles.statCard} ${styles.statCard2}`}>
            <h3>{res?.urun_kategori_adedi}</h3>
            <p>Ürün Kategori Adedi</p>
          </div>
          <div className={`${styles.statCard} ${styles.statCard3}`}>
            <h3>{res?.referanslar_adedi}</h3>
            <p>Referans Adedi</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;



