
import React, { useState, useEffect } from 'react';
import SurguluBanner from '../compenent/SurguluBanner'
import Head from 'next/head';
import AnaSayfaKategori from '@/compenent/AnaSayfaKategori';
import Vitrin from '@/compenent/Vitrin';


function Index() {


  return (
    <>
    <Head>
      <title>Flexsoft</title>
      <meta name="description" content="Flexsoft, bir e-ticaret sitesidir ve yazılım hizmetleri vermektedir. Butik ve giyim mağazalarına yöneliktir." />
    </Head>

    <SurguluBanner/>
    <AnaSayfaKategori/>
    <Vitrin/>
    
 
    </>
  );
}

export default Index;
