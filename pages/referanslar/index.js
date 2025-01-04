import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import styles from "./referans.module.css";
import { API_ROUTES } from '@/utils/constants';
import axios from 'axios';
import Link from "next/link";
import { CircularProgress } from "@mui/material";
import Head from "next/head";
import { Pagination,PaginationItem } from '@mui/material';


const Referans = () => {
  const [references, setReferences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1
  const [totalPages, setTotalPages] = useState(0);


  useEffect(() => {
    const fetchReferences = async () => {
      setIsLoading(true);
      try {
        const referencesResponse = await axios.get(API_ROUTES.REFERENCES_ACTIVE.replace("currentPage",page));
        const data= referencesResponse.data.results; 
        setTotalPages(Math.ceil(referencesResponse.data.count / 20));
        setReferences(data);
      } catch (error) {
        console.error("Referanslar alınırken bir hata oluştu:", error);
        router.push("/hata-sayfasi");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReferences();
  }, [searchParams]);



  return (
    <>
      <Head>
        <title>Flexsoft | Referanslar</title>
        <meta
          name="description"
          content={`Flexsoft, bir e-ticaret sitesidir ve yazılım hizmetleri vermektedir. Butik ve giyim mağazalarına yönelik referanslarımız: ${references.map(ref => ref.name).join(', ')}.`}
        />
      </Head>

        {isLoading ? (
          <div className={styles.loadingOverlay}>
            <CircularProgress sx={{ color: 'rgb(29,29,31)' }} />
          </div>
          ):( 
          <div className={styles.container}>
            <div className={styles.siteMap}>
              <Link href="/">
                <div className={styles.mapText}>Ana Sayfa</div>
              </Link>
              <span className={styles.icon}>/</span>
              <div className={`${styles.mapText} ${styles.activeText}`}>Referanslar</div>
            </div>

            <div className={styles.baslikContainer}>
              <h1>Referanslar</h1>
            </div>

            <div className={styles.altContainer}>

              {references.length > 0 ? (
                <div className={styles.productContainer}>
                  {references.map(product => (
                    <div key={product.id} className={styles.productItem}>
                        <img
                        className={styles.productItemImage}
                        src={product.img}
                        alt={product.name}
                    />
                        <a href={product.url}>
                          <p className={styles.productItemTitle}>{product.name}</p>
                        </a>
                    </div>
                    ))}
                </div>
              ) : (
                <div className={styles.icerikYok}>
                  Henüz içerik eklenmemiştir.
                </div>
              )}

              {references.length > 0 && (
                <div className={styles.paginationContainer}>
                  <Pagination
                    count={totalPages} // Toplam sayfa sayısı
                    page={page} // Geçerli sayfa
                    color="primary"
                    sx={{
                      '.MuiPaginationItem-root': {
                        fontSize: '1rem',
                        fontWeight: 500,
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        backgroundColor: '#d6d6d6', // Aktif olmayan buton arka plan rengi (biraz daha koyu)
                        color: '#333', // Yazı rengi
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: '#bdbdbd', // Hover sırasında biraz daha koyu bir gri
                        },
                      },
                      '.Mui-selected': {
                        backgroundColor: 'rgb(29, 29, 31) !important', // Aktif sayfa arka plan rengi
                        color: '#fff', // Aktif sayfa yazı rengi
                        fontWeight: 'bold',
                        '&:hover': {
                          backgroundColor: 'rgb(29, 29, 31) !important', // Hover sırasında aynı renk
                          boxShadow: '0px 6px 8px rgba(0, 0, 0, 0.3)',
                        },
                      },
                    }}
                    renderItem={(item) => (
                      <Link
                        href={`/referanslar/?page=${item.page}`}
                        passHref
                      >
                        <PaginationItem {...item} />
                      </Link>
                    )}
                  />
                </div>
              )}
            </div>
          </div>
      )}
    </>
  );
};

export default Referans;
