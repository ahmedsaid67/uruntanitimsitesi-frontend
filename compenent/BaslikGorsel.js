import React, { useEffect, useState, memo } from 'react';
import styles from '../styles/BaslikGorsel.module.css';
import CircularProgress from '@mui/material/CircularProgress'; 
import axios from 'axios';
import { API_ROUTES } from '@/utils/constants';

function BaslikGorsel({ slug }) {
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const getBaslikGorsel = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(API_ROUTES.BASLIK_GORSEL_GET_GORSEL.replace("data", slug));
            setData(response.data);
            console.log("response:",response.data)
        } catch (error) {
            console.error("İstek sırasında bir hata oluştu:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (slug) {
            getBaslikGorsel();
        }
    }, [slug]);

    return (
        <div className={styles.bannerImageContainer}>
            <div className={styles.aspectRatioBox}>
                {isLoading || !slug ? (
                    <div className={styles.loader}>
                        <CircularProgress style={{ color: 'black' }} />
                    </div>
                ) : data.img ? (
                    <img src={data.img} alt="Banner" className={styles.image} />
                ) : null}
            </div>
        </div>
    );
}

export default memo(BaslikGorsel);
// isLoading || !slug   ---> slugu da ekledık.slug stateı 3 renderda dondugunden o tam gekene kadar loadıng devam etmelıdır.