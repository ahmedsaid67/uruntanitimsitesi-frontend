import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, Box, Grid, CircularProgress, Container, Alert } from '@mui/material';
import axios from 'axios';
import { API_ROUTES } from '@/utils/constants';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

const Iletisim = () => {
  const [phones, setPhones] = useState(['', '']);
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
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

  useEffect(() => {
    if (!user.id) {
      router.push({
        pathname: "/login",
        query: {from: router.pathname},
      });
    }else{
      getData()
      console.log("user:",user.id)
    }
  }, [user,currentPage]);

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
      const method = id ? 'put' : 'post'; // id varsa PUT, yoksa POST
      const url = id ? `${API_ROUTES.ILETISIM.replace("id/", "")}${id}/` : API_ROUTES.ILETISIM.replace("id/", "");
  
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' ,width:'100%'}}>
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
    <div className='content'>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          width: '98%',
          height:'350px',
          margin: ' 0 20px',
          padding: '20px',
          background: '#fff',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          boxSizing: 'border-box',
          position: 'relative', // Box'ı konumlandırmak için relative yapıyoruz
        }}
      >
        <h2 style={{ marginBottom: '16px',marginTop:"8px" }}>
          İletişim Bilgileri
        </h2>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Grid container spacing={2}>
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
              position: 'absolute', // Button'ı absolute yapıyoruz
              bottom: '20px', // Box'ın altından 20px yukarıda konumlandırıyoruz
              right: '20px', // Box'ın sağından 20px içeride konumlandırıyoruz
            }}
          >
            <Button
              variant="contained"
              color="primary"
              type="submit"
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

