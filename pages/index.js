
import React, { useState, useEffect } from 'react';
import SurguluBanner from '../compenent/SurguluBanner'
import Head from 'next/head';
import AnaSayfaKategori from '@/compenent/AnaSayfaKategori';
import Vitrin from '@/compenent/Vitrin';


function Index() {


  return (
    <>
    <Head>
        <title>Panelli Tanıtım Sitesi</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
    </Head>

    <SurguluBanner/>
    <AnaSayfaKategori/>
    <Vitrin/>
    

 
    </>
  );
}

export default Index;