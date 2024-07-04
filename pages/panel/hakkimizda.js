import React, { useState, useEffect } from 'react';
import { Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { API_ROUTES } from '@/utils/constants';
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
        getData(); // Güncellenmiş veriyi tekrar al
      } else {
        console.error('İşlem hatası:', response.statusText);
      }
    } catch (error) {
      console.error('İşlem hatası:', error);
    }
  };

  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          width: '100%',
          height: '500px',
          margin: '20px auto', // Center the box horizontally
          padding: '20px',
          paddingBottom: '60px', // Add padding at the bottom to accommodate the button
          background: '#fff',
          overflow: 'hidden',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Slightly increase shadow for depth
          borderRadius: '8px', // Add rounded corners
          boxSizing: 'border-box',
          position: 'relative', // Box'ı konumlandırmak için relative yapıyoruz
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ color: '#333', fontWeight: 'bold' }}> {/* Slightly darker color and bold text */}
          Hakkımızda
        </Typography>
        <Box
          sx={{
            mb: 2,
            width: '100%', // Full width for better alignment
            height: '100%', // Set a fixed height for the editor
            borderRadius: '4px', // Rounded corners for the editor
            border: '1px solid #ddd', // Light border for better separation
            overflow: 'hidden',
          }}
        >
          <TextEditor
            value={content}
            onChange={(newContent) => setContent(newContent)}
          />
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{
            position: 'absolute', // Button'ı absolute yapıyoruz
            bottom: '20px', // Box'ın altından 20px yukarıda konumlandırıyoruz
            right: '20px', // Box'ın sağından 20px içeride konumlandırıyoruz
            backgroundColor: '#1976d2', // Primary color
            '&:hover': {
              backgroundColor: '#155a9a', // Darker shade on hover
            },
            borderRadius: '4px', // Rounded corners for the button
          }}
        >
          {buttonText}
        </Button>
      </Box>
    </div>
  );
};

export default Hakkimizda;
