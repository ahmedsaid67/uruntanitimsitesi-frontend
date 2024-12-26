// components/Layout.js

import { useEffect,useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { deleteTokenFromCookie } from "../context/features/lib/common";
import { getCookie } from "cookies-next";
import { setUser, userLoggedOut } from "../context/features/user/userSlice";
import { loginSuccess, logout } from "../context/features/auth/loginSlice";
import { showMessage } from "../context/features/message/messageSlice";
import { useSelector } from 'react-redux';

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { useRouter } from 'next/router';
import styles from "../styles/Layout.module.css";

import Notifications from "./Notifications";
import CircularProgress from '@mui/material/CircularProgress';
import React, { useMemo } from 'react';

import {API_SERVER_URL} from "../utils/constants"
import {API_ROUTES} from "../utils/constants"
import AltBar from "./AltBar";

const Layout = ({ children }) => {
  const router = useRouter();
  const isPanelPage = router.pathname.includes('/panel');
  const isLoginPage = router.pathname.includes('/login');
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);

useEffect(() => {
    axios.defaults.headers.common["Accept-Language"] = "tr-tr"; // navigator.language || navigator.userLanguage || "tr-tr";
    axios.defaults.baseURL = API_SERVER_URL;
    axios.interceptors.response.use(
      (response) => {
        return response;
      },

      async (err) => {
        const originalConfig = err.config;
        if (err.response.status === 401) {  // yanıt 401 hatası dönecek ise;
          axios.defaults.headers.common["Authorization"] = null;
          if (getCookie("token"))
            dispatch(
              showMessage({
                message: "Token süresi dolmuştur. Paneli görüntülemek için tekrar giriş yapmanız gerekecektir.",
                variant: "info",
              })
            );
          deleteTokenFromCookie();
          dispatch(userLoggedOut());
          dispatch(logout());
          return Promise.reject(err);
        }
        return Promise.reject(err);    
      }
    );
    async function getUser() {
      try {
        const res = await axios.get(API_ROUTES.USER_INFO);
        dispatch(loginSuccess());
        dispatch(setUser(res.data));
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    }

    const token = getCookie("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `token ${token}`;
      getUser();
    } else {
      setLoading(false);
    }
    return () => {};                 
  }, [dispatch]);

  if (loading) {
    return (
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 999,
        }}
      >
        <CircularProgress style={{ color: !isPanelPage ? 'black' : 'defaultColor' }}/>

      </div>
    );
  }

  if (isLoginPage) {
    // Render only the children components for login page
    return <>
    {children}
    <Notifications/>
    </>
  }
  

  return (
     <>   
            {isPanelPage ? (
              
              <Sidebar>
                {children}
              </Sidebar>):(
              <div className={styles.container}>
                <div className={styles.contentWrapper}>
                    <div className={styles.pageContainer}>
                      <Navbar />
                      <div className={styles.pageContent}>{children}</div>                     
                    </div>
                </div> 
             {/*
             <div className={styles.altBar} >
                <AltBar/>
              </div>
             */}
          
          <Footer />
          
        </div>
      )}

      <Notifications/>


    </>
  );
};

export default Layout;