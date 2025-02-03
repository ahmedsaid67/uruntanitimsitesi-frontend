import React from 'react';
import axios from 'axios';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from "./urundetay.module.css";
import { API_ROUTES } from '@/utils/constants';
import Link from 'next/link';
import Head from 'next/head';
import { FaWhatsapp } from "react-icons/fa";
import RelatedProducts from '../../../compenent/RelatedProducts';
import ContainerıImage from '../../../compenent/ContainerıImage';

// Ürün detayını çeken fonksiyon
export const getDataById = async (slug) => {
  try {
    const productsResponse = await axios.get(
      API_ROUTES.URUNLER_DETAIL_PURE.replace("urunSlug", slug)
    );
    return productsResponse.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw { error: "Product not found." }; // 404 hatası için özel mesaj
    }
    throw { error: "Veriler yüklenirken beklenmeyen bir sorun oluştu. Daha sonra tekrar deneyiniz." }; // Diğer hatalar için genel mesaj
  }
};

// Kategoriye göre ürünleri çeken fonksiyon
export const getCategoryBySlug = async (slug) => {
  try {
    const url = API_ROUTES.URUNLER_KATEGORI_FILTER_PAGINATIONSUZ.replace("seciliKategori", slug);
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw { error: "Kategori verisi yüklenirken bir sorun oluştu." }; // Kategori hatası için özel mesaj
  }
};

// SSR için verileri çeken fonksiyon
export async function getServerSideProps(context) {
  const { slug } = context.params;

  try {
    const productData = await getDataById(slug);

    // Eğer ürün bulunamazsa (404 hatası)
    if (productData.error === "Product not found.") {
      return {
        props: {
          error: "Product not found.", // Özel hata mesajı
        },
      };
    }

    // Kategori verisini çek
    const categoryData = await getCategoryBySlug(productData.urun_kategori.slug);

    return {
      props: {
        product: productData,
        relatedProducts: categoryData.results || [], // Eğer results yoksa boş bir dizi döndür
      },
    };
  } catch (error) {
    return {
      props: {
        error: error.error || "Veriler yüklenirken beklenmeyen bir sorun oluştu. Daha sonra tekrar deneyiniz. ", // Hata mesajını bileşene geç
      },
    };
  }
}

// Ana bileşen
const UrunDetay = ({ product, relatedProducts, error }) => {
  if (error) {
    return (
      <div className={styles.errorContainer}>
        {error === "Product not found." ? (
          <>
            <p className={styles.errorMessage}>Böyle bir ürünümüz bulunmamaktadır.</p>
            <Link href="/urunlerimiz">
              <button className={styles.returnButton}>Ürünlerimize Göz Atın</button>
            </Link>
          </>
        ) : (
          <p className={styles.errorMessage}>{error}</p>
        )}
      </div>
    );
  }


  return (
    <div>
      <Head>
        <title>Flexsoft | {product.baslik}</title>
        <meta name="description" content="Flexsoft bir e-ticaret sitesidir ve yazılım hizmetleri vermektedir. Butik ve giyim mağazalarına yöneliktir." />
      </Head>

      <div className={styles.container}>
        <div className={styles.siteMap}>
          <Link href="/">
            <div className={styles.mapText}>Ana Sayfa</div>
          </Link>
          <span className={styles.icon}>/</span>
          <Link href="/urunlerimiz">
            <div className={styles.mapText}>Ürünlerimiz</div>
          </Link>
          <span className={styles.icon}>/</span>
          <Link href={`/urunlerimiz?tab=${product.urun_kategori.slug}`}>
            <div className={styles.mapText}>{product.urun_kategori.baslik}</div>
          </Link>
          <span className={styles.icon}>/</span>
          <div className={`${styles.mapText} ${styles.activeText}`}>{product.baslik}</div>
        </div>
      </div>

      <div className={styles.styleContainer}>
        <ContainerıImage getImage={product.images} />
        <div className={styles.detailContainer}>
          <div className={styles.detailContent}>
            <h1 className={styles.detailText}>{product.baslik}</h1>

            {product.fiyat && <p className={styles.detailPrice}>{product.fiyat}</p>}

            {product.ozellikler && product.ozellikler.length > 0 && (
              <>
            <div className={styles.smallBaslik}>Renk:</div>

            <div className={styles.ozellikContainer}>
              {product.ozellikler.map((item, index) => (
                <span key={index} className={styles.ozellikItem}>
                  {item.name}
                </span>
              ))}
            </div>

            </>
            )}

            {product.bedenler && product.bedenler.length > 0 && (
              <>
            <div className={styles.smallBaslik}>Beden:</div>

            <div className={styles.boxContainer}>
              {product.bedenler.map(size => (
                <span key={size.id} className={styles.box}>
                  {size.numara}
                </span>
              ))}
            </div>
            </>
            )}

            {product.aciklama && (
              <div
                className={styles.detailDescription}
                dangerouslySetInnerHTML={{ __html: product.aciklama }}
              />
            )}

            <a
              href="https://wa.me/905355424680"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappLink}
            >
              <FaWhatsapp style={{ fontSize: '1.5rem', marginRight: '1rem' }} />
              WhatsApp ile iletişime geçin
            </a>
          </div>
        </div>
      </div>

      {relatedProducts.length > 1 && (
        <RelatedProducts products={relatedProducts} currentProductId={product.id} />
      )}
    </div>
  );
};

export default UrunDetay;