import React, { useState, useEffect } from 'react';
import { Button, TextField, Box, Grid, CircularProgress, Container, Alert, InputAdornment } from '@mui/material';
import axios from 'axios';
import { API_ROUTES } from '@/utils/constants';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faInstagram, faFacebook, faTiktok, faLinkedin, faYoutube } from '@fortawesome/free-brands-svg-icons';

const SosyalMedya = () => {
  const [socialMedia, setSocialMedia] = useState({
    twitter: '',
    instagram: '',
    facebook: '',
    tiktok: '',
    linkedin: '',
    youtube: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [id, setId] = useState(null);
  const router = useRouter();
  const user = useSelector((state) => state.user);

  const buttonText = id ? 'Güncelle' : 'Kaydet';

  useEffect(() => {
    // Fetch existing social media data
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_ROUTES.MEDYA_DETAIL}`);
        if (response.data) {
          setSocialMedia({
            twitter: response.data.twitter || '',
            instagram: response.data.instagram || '',
            facebook: response.data.facebook || '',
            tiktok: response.data.tiktok || '',
            linkedin: response.data.linkedin || '',
            youtube: response.data.youtube || '',
          });
          setId(response.data.id);
        }
      } catch (error) {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSocialMedia((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (id) {
        await axios.put(API_ROUTES.MEDYA_DETAIL, socialMedia);
      } else {
        await axios.post(API_ROUTES.MEDYA_DETAIL, socialMedia);
      }
      router.reload(); // Reload the page to reflect changes
    } catch (error) {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100%' }}>
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

  const iconMap = {
    twitter: faTwitter,
    instagram: faInstagram,
    facebook: faFacebook,
    tiktok: faTiktok,
    linkedin: faLinkedin,
    youtube: faYoutube,
  };

  return (
    <div className='content'>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          width: '98%',
          height: '575px',
          margin: '0 20px',
          padding: '20px',
          background: '#fff',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        <h2 style={{ marginBottom: '16px', marginTop: '8px' }}>
          Sosyal Medya
        </h2>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Grid container spacing={2}>
            {Object.keys(socialMedia).map((key) => (
              <Grid item xs={12} key={key}>
                <TextField
                  fullWidth
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  variant="outlined"
                  name={key}
                  value={socialMedia[key]}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FontAwesomeIcon icon={iconMap[key]} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            ))}
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
            >
              {buttonText}
            </Button>
          </Box>
        </form>
      </Box>
    </div>
  );
};

export default SosyalMedya;
