
import React, { useState, useEffect } from 'react';
import SurguluBanner from '../compenent/SurguluBanner'
import Head from 'next/head';
import AnaSayfaKategori from '@/compenent/AnaSayfaKategori';
import Vitrin from '@/compenent/Vitrin';


function Index() {


  return (
    <>
    <Head>
    <title>Flexsoft | Panelli Tanıtım Sitesi</title>
        <meta name="description" content="Flexsoft, bir e-ticaret sitesidir ve yazılım hizmetleri vermektedir. Butik ve giyim mağazalarına yöneliktir." />
        <meta name="keywords" content="e-ticaret, yazılım, butik, giyim mağazaları,site satın al,web site satın al,hazır site satın al,web site kurma,web site tasarımı,butik web site,butik web site satın al,mağaza web site satın al,web site fiyatları, Flexsoft" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Flexsoft | Panelli Tanıtım Sitesi" />
        <meta property="og:description" content="Flexsoft, bir e-ticaret sitesidir ve yazılım hizmetleri vermektedir. Butik ve giyim mağazalarına yöneliktir." />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      
    </Head>

    <SurguluBanner/>
    <AnaSayfaKategori/>
    <Vitrin/>
    

 
    </>
  );
}

export default Index;
