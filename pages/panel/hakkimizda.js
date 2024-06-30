import React, { useState, useEffect } from 'react';
import { Modal, Button, Typography, Box, Grid } from '@mui/material';
import axios from 'axios';
import { API_ROUTES } from '@/utils/constants';
import dynamic from 'next/dynamic';

// Dinamik olarak TextEditor bileşenini yükle
const TextEditor = dynamic(() => import('@/compenent/Editor'), { ssr: false });

const Hakkimizda = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [id, setId] = useState(null); // Verinin id'si

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

  // Form gönderme işlemi
  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = { content };

    try {
      const method = id ? 'PUT' : 'POST'; // id varsa PUT, yoksa POST
      const url = id ? `${API_ROUTES.HAKKIMIZDA.replace("id/", "")}${id}/` : API_ROUTES.HAKKIMIZDA.replace("id/", "");
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      if (response.ok) {
        const result = await response.json();
        console.log('İşlem başarılı:', result);
        setIsOpen(false);
        getData(); // Güncellenmiş veriyi tekrar al
      } else {
        console.error('İşlem hatası:', response.statusText);
      }
    } catch (error) {
      console.error('İşlem hatası:', error);
    }
  };

  // Buton metni, veri olup olmadığına göre ayarlanıyor
  const buttonText = data ? 'Güncelle' : 'Hakkımızda Bilgilerini Gir';

  return (
    <div>
      <Button variant="contained" color="primary" onClick={() => setIsOpen(true)}
        sx={{
          marginLeft:'1.5em',
        }}
        >
        {buttonText}
      </Button>

      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            height: '70%',
            bgcolor: 'background.paper',
            overflow: "auto",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            {buttonText}
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextEditor
                  value={content}
                  onChange={(newContent) => setContent(newContent)}
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="primary" type="submit">
                  Kaydet
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          width: '90%',
          height: '60%',
          margin: '20px',
          padding: '20px',
          background: '#fff',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          overflow: 'auto', /* Taşan içerikleri gizle */
          boxSizing: 'border-box',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Hakkımızda
        </Typography>
        <Box sx={{ mb: 2, width: '100%' }}>
          <Typography
            sx={{
              overflowWrap: 'break-word', /* Uzun kelimeleri ve satırları kırar */
              wordBreak: 'break-word',
            }}
            dangerouslySetInnerHTML={{ __html: content || 'Veri bulunamadı' }}
          ></Typography>
        </Box>
      </Box>
    </div>
  );
};

export default Hakkimizda;
