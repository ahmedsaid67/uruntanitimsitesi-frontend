import styles from "./hakkimizda.module.css";
import axios from 'axios';
import { API_ROUTES } from '@/utils/constants';
import Head from "next/head";
import Link from "next/link";
import { useRouter } from 'next/router';

const Hakkimizda = ({ content, data, error }) => {
  const router = useRouter();

  if (error) {
    router.push('/hata-sayfasi');
    return null;
  }

  return (
    <>
      <Head>
      <title>Hakkımızda | Flexsoft</title>
      <meta name="description" content="Flexsoft hakkında detaylı bilgi edinin. Flexsoft ile ilgili her şey burada."/>
      </Head>

      <div className={styles.container}>
        <div className={styles.siteMap}>
          <Link href="/">
            <div className={styles.mapText}>Ana Sayfa</div>
          </Link>
          <span className={styles.icon}>/</span>
          <div className={`${styles.mapText} ${styles.activeText}`}>Hakkımızda</div>
        </div>

        <div className={styles.baslikContainer}>
          <h1>Hakkımızda</h1>
        </div>

        <div className={styles.content} dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </>
  );
};

export const getServerSideProps = async () => {
  try {
    const response = await axios.get(API_ROUTES.HAKKIMIZDA.replace("id/", ""));
    const result = response.data.results[0]; // İlk sonucu al

    if (!result) {
      return {
        props: {
          error: true,
        },
      };
    }

    const { content, id } = result;

    return {
      props: {
        content: content || '',
        data: result,
        error: false,
      },
    };
  } catch (error) {
    console.error('Veri çekme hatası:', error);
    return {
      props: {
        error: true,
      },
    };
  }
};

export default Hakkimizda;
