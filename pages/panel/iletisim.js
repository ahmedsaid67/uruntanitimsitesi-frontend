import React, { useState, useEffect } from 'react';
import { Modal, Button, TextField, Typography, Box, Grid } from '@mui/material';
import axios from 'axios';
import { API_ROUTES } from '@/utils/constants';

const Iletisim = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [phones, setPhones] = useState(['', '']);
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [id, setId] = useState(null); // Verinin id'si

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
  const buttonText = data ? 'Güncelle' : 'İletişim Bilgilerini Gir';

  return (
    <div className='content'>
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
            width: 400,
            bgcolor: 'background.paper',
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
          margin: '20px',
          padding: '20px',
          background: '#fff',
          border: '1px solid #ccc',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Özet
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">E-postalar</Typography>
          <Typography>{email || 'Veri bulunamadı'}</Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">Telefonlar</Typography>
          {phones.filter(phone => phone).length > 0 ? (
            phones.filter(phone => phone).map((phone, index) => (
              <Typography key={index}>{phone}</Typography>
            ))
          ) : (
            <Typography>Veri bulunamadı</Typography>
          )}
        </Box>
        <Box>
          <Typography variant="h6">Adresler</Typography>
          <Typography>{address || 'Veri bulunamadı'}</Typography>
        </Box>
      </Box>
    </div>
  );
};

export default Iletisim;
