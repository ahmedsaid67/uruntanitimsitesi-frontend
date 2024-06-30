import React, { useState, useEffect } from 'react';
import { Modal, Button, TextField, Typography, Box, Grid } from '@mui/material';
import { API_ROUTES } from '@/utils/constants';

// API URL'nizi tanımlayın


const Iletisim = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [phones, setPhones] = useState(['', '']);
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [data, setData] = useState({ email: '', phones: ['', ''], address: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(API_ROUTES.ILETISIM);
        console.log(response);
        if (response.ok) {
          const result = await response.json();
          // API'dan gelen veriyi state'e aktar
          setData({
            email: result.email || '',
            phones: result.phones || ['', ''],
            address: result.address || '',
          });
          // State'leri güncelle
          setEmail(result.email || '');
          setPhones(result.phones || ['', '']);
          setAddress(result.address || '');
        }
      } catch (error) {
        console.error('Veri çekme hatası:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePhoneChange = (index, value) => {
    const newPhones = [...phones];
    newPhones[index] = value;
    setPhones(newPhones);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = { email, phones, address };

    try {
      const response = await fetch(API_ROUTES.HAKKIMIZDA, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      if (response.ok) {
        const result = await response.json();
        console.log('Güncelleme başarılı:', result);
        setIsOpen(false);
        // Güncellenmiş veriyi API'dan tekrar çekin
        const fetchData = async () => {
          try {
            const response = await fetch(API_ROUTES.HAKKIMIZDA);
            if (response.ok) {
              const result = await response.json();
              setData({
                email: result.email || '',
                phones: result.phones || ['', ''],
                address: result.address || '',
              });
              setEmail(result.email || '');
              setPhones(result.phones || ['', '']);
              setAddress(result.address || '');
            }
          } catch (error) {
            console.error('Veri çekme hatası:', error);
          }
        };

        fetchData();
      } else {
        console.error('Güncelleme hatası:', response.statusText);
      }
    } catch (error) {
      console.error('Güncelleme hatası:', error);
    }
  };

  return (
    <div className='content'>
      <Button variant="contained" color="primary" onClick={() => setIsOpen(true)}>
        İletişim Bilgilerini Gir
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
            İletişim Bilgilerini Gir
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              {phones.map((phone, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <TextField
                    fullWidth
                    label={`Phone ${index + 1}`}
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
                  label="Address:"
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
