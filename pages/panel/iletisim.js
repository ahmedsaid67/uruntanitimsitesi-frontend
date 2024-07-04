import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, Box, Grid, CircularProgress, Container, Alert } from '@mui/material';
import axios from 'axios';
import { API_ROUTES } from '@/utils/constants';

const Iletisim = () => {
  const [phones, setPhones] = useState(['', '']);
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
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
      const response = await axios.get(API_ROUTES.ILETISIM.replace("id/", ""));
      const result = response.data.results[0]; // İlk sonucu al
      if (result) {
        const { email, phone1, phone2, address, id } = result;
        setData(result);
        setEmail(email || '');
        setPhones([phone1 || '', phone2 || '']);
        setAddress(address || '');
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

  // Telefon değişikliği işlemi
  const handlePhoneChange = (index, value) => {
    const newPhones = [...phones];
    newPhones[index] = value;
    setPhones(newPhones);
  };

  // Form gönderme işlemi
  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = { email, phone1: phones[0], phone2: phones[1], address };

    try {
      const method = id ? 'PUT' : 'POST'; // id varsa PUT, yoksa POST
      const url = id ? `${API_ROUTES.ILETISIM.replace("id/", "")}${id}/` : API_ROUTES.ILETISIM.replace("id/", "");

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
          Menü öğeleri alınırken bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.
        </Alert>
      </Container>
    );
  }

  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          width: '100%',
          height: 'auto', // Adjust height automatically based on content
          margin: '20px auto', // Center the box horizontally
          padding: '20px', // Add extra padding at the bottom for the button
          background: '#fff',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Slightly increase shadow for depth
          borderRadius: '8px', // Add rounded corners
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        <Typography variant="h5"  sx={{ color: '#333', fontWeight: 'bold' }}> {/* Slightly darker color and bold text */}
          İletişim Bilgileri
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Grid container spacing={2} sx={{ marginTop: '1em' }}> {/* Added marginTop for spacing */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="E-posta"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            {phones.map((phone, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <TextField
                  fullWidth
                  label={`Telefon ${index + 1}`}
                  variant="outlined"
                  value={phone}
                  onChange={(e) => handlePhoneChange(index, e.target.value)}
                  placeholder="Telefon"
                />
              </Grid>
            ))}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Adres"
                variant="outlined"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Grid>
          </Grid>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '1em',
              position: 'absolute',
              bottom: '20px',
              right: '20px',
            }}
          >
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{
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
        </form>
      </Box>
    </div>
  );
};

export default Iletisim;
