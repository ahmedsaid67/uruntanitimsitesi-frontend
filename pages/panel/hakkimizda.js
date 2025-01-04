import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, CircularProgress } from '@mui/material';
import axios from 'axios';
import { API_ROUTES } from '@/utils/constants';

import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import dynamic from 'next/dynamic';
// Dinamik olarak TextEditor bileşenini yükle
const TextEditor = dynamic(() => import('@/compenent/Editor'), { ssr: false });

const Hakkimizda = () => {
  const [content, setContent] = useState('');
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [id, setId] = useState(null); // Verinin id'si
  const buttonText = data ? 'Güncelle' : 'Kaydet';
  
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const user = useSelector((state) => state.user);

  // Veriyi API'den al
  const getData = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await axios.get(API_ROUTES.HAKKIMIZDA.replace("id/", ""));
      const result = response.data.results[0]; // İlk sonucu al
      if (result) {
        const { content, id } = result;
        setData(result);
        setContent(content || ''); // Varsayılan olarak boş içerik
        setId(id); // Verinin id'sini sakla
      }
    } catch (error) {
      setHasError(true);
      console.error('Veri çekme hatası:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (!user.id) {
      router.push({
        pathname: "/login",
        query: {from: router.pathname},
      });
    }else{
      getData()
    }
  }, [user,currentPage]);

  // Form gönderme işlemi
  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = { content };
  
    try {
      const method = id ? 'put' : 'post'; // id varsa PUT, yoksa POST
      const url = id ? `${API_ROUTES.HAKKIMIZDA.replace("id/", "")}${id}/` : API_ROUTES.HAKKIMIZDA.replace("id/", "");
  
      const response = await axios({
        method: method,
        url: url,
        headers: {
          'Content-Type': 'application/json',
        },
        data: updatedData,
      });
  
      console.log('İşlem başarılı:', response.data);
      getData(); // Güncellenmiş veriyi tekrar al
    } catch (error) {
      console.error('İşlem hatası:', error.response ? error.response.data : error.message);
    }
  };  

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',width:'100%' }}>
        <CircularProgress />
      </div>
    );
  }

  if (hasError) {
    return (
      <Container>
        <Alert severity="error">
          Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.
        </Alert>
      </Container>
    );
  }

  return (
    <div style={{ width: '95%' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          width: '100%',
          height: '550px',
          margin: '0 20px',
          padding: '20px 20px 80px',
          background: '#fff',
          overflow: 'hidden',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          boxSizing: 'border-box',
          position: 'relative' // Box'ı konumlandırmak için relative yapıyoruz
        }}
      >
        <h2 style={{ marginBottom: '8px', marginTop: '8px' }}>
          Hakkımızda
        </h2>
        <Box
          sx={{
            mb: 2,
            width: '100%', // TextEditor'ün tam ekran genişliği
            height: '80%', // Editör alanı için sabit bir yükseklik belirleyin
          }}
        >
          <TextEditor
            value={content}
            onChange={(newContent) => setContent(newContent)}
            style={{ width: '100%' }} // TextEditor bileşeninin genişliğini tam ekran genişliğe ayarlayın
          />
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
          }}
        >
          {buttonText}
        </Button>
      </Box>
    </div>

  );
};

export default Hakkimizda;