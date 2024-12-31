import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch ,useSelector} from 'react-redux';
import { AppBar, Box, Toolbar, IconButton, Typography, List, ListItem, ListItemText, CssBaseline, CircularProgress } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Head from 'next/head';
import styles from '../styles/Sidebar.module.css';
import { faAddressCard,faShoppingCart,  faCircleInfo, faFile, faHandshake, faHashtag, faHouse, faImage, faLink, faList, faMap, faSliders } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { submitLogout } from '../context/features/auth/loginSlice';


const drawerWidth = 270;

const MenuListItems = [
  {
    id: 1,
     text: <><span className={styles.icon}><FontAwesomeIcon icon={faHouse} /></span> Ana Sayfa</>,
    url: '/panel/ana-sayfa',
  },
  {
    id: 2,
    text: <><span className={styles.icon}><FontAwesomeIcon icon={faSliders} /></span> Banner</>,
    url: '/panel/sliders',
  },
  {
    id: 3,
    text: <><span className={styles.icon}><FontAwesomeIcon icon={faHashtag} /></span> Sosyal Medya</>,
    url: '/panel/sosyal-medya',
  },
  {
    id: 4,
    text: <><span className={styles.icon}><FontAwesomeIcon icon={faLink} /></span> Hızlı Linkler</>,
    url: '/panel/hizli-linkler',
  },
  {
    id: 5,
    text: <><span className={styles.icon}><FontAwesomeIcon icon={faHandshake} /></span> Referanslar</>,
    url: '/panel/references',
  },
  {
    id: 6,
    text:  <><span className={styles.icon}><FontAwesomeIcon icon={faShoppingCart} /></span> Ürünler</>,

    children: [
      { id: 81, text: 'Ürün Kategori', url: '/panel/urunler/urun-kategori' },
      { id: 82, text: 'Ürün Vitrin', url: '/panel/urunler/urun-vitrin' },
      { id: 83, text: 'Ürünler', url: '/panel/urunler/urunler' },
    ],
  },
  {
    id:7,
    text:  <><span className={styles.icon}><FontAwesomeIcon icon={faAddressCard} /></span> İletişim</>,
    url: '/panel/iletisim',
  },
  {
    id:8,
    text:  <><span className={styles.icon}><FontAwesomeIcon icon={faCircleInfo} /></span> Hakkımızda</>,
    url: '/panel/hakkimizda',
  }
];

const NestedList = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMainTab, setActiveMainTab] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState(null);
  const [activeSubSubTab, setActiveSubSubTab] = useState(null);
  const [expandedMainTabs, setExpandedMainTabs] = useState({});
  const [selectedSubItems, setSelectedSubItems] = useState([]);
  const [selectedSubSubItems, setSelectedSubSubItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  useEffect(() => {
    const path = router.pathname;
    let activeMainItem, activeSubItem, activeSubSubItem;

    MenuListItems.forEach(item => {
      if (item.url === path) {
        activeMainItem = item;
      }
      item.children?.forEach(subItem => {
        if (subItem.url === path) {
          activeMainItem = item;
          activeSubItem = subItem;
        }
        subItem.children?.forEach(subSubItem => {
          if (subSubItem.url === path) {
            activeMainItem = item;
            activeSubItem = subItem;
            activeSubSubItem = subSubItem;
          }
        });
      });
    });

    if (activeMainItem) {
      setActiveMainTab(activeMainItem.id);
      setExpandedMainTabs(prev => ({ ...prev, [activeMainItem.id]: true }));
      setSelectedSubItems(activeMainItem.children || []);
    }
    if (activeSubItem) {
      setActiveSubTab(activeSubItem.id);
      setSelectedSubSubItems(activeSubItem.children || []);
    }
    if (activeSubSubItem) {
      setActiveSubSubTab(activeSubSubItem.id);
    }
  }, [router.pathname]);

  const logout = () => {
    dispatch(submitLogout());
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMainTabChange = (item) => {
    const isExpanded = expandedMainTabs[item.id];
    
    // Önce state güncellemelerini yapalım
    setExpandedMainTabs(prev => ({ ...prev, [item.id]: !isExpanded }));
    setActiveMainTab(item.id);
    setSelectedSubItems(item.children || []);
    
    // Alt sekmeleri sıfırlayalım
    setActiveSubTab(null);
    setSelectedSubSubItems([]);

    // Eğer URL varsa ve sekme kapalıysa veya alt menüsü yoksa yönlendirelim
    if (item.url && (!item.children || !isExpanded)) {
      router.push(item.url);
    }
  };

  const handleSubTabChange = (item) => {
    if (item.url) {
      router.push(item.url);
    } else {
      setActiveSubTab((prev) => (prev === item.id ? null : item.id));
      setSelectedSubSubItems(item.children || []);
    }
  };

  const handleSubSubTabChange = (item) => {
    if (item.url) {
      router.push(item.url);
    } else {
      setActiveSubSubTab(item.id);
    }
  };

  return (
    <>
      <Head>
        <title>Flexsoft Panel</title>
      </Head>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" sx={{ width: '100%', ml: { sm: `${drawerWidth}px` }, backgroundColor: 're', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
            Flexsoft
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton color="inherit" onClick={logout}>
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 }, height:'100vh', position:'sticky', top:'0' }}
        >
          <Toolbar />
          <Box
            sx={{ overflowY: 'auto', height: 'calc(100vh - 64px)', bgcolor: '#3a3b3c', color: 'white' }}
          >
            <List>
              {MenuListItems.map(item => (
                <React.Fragment key={item.id}>
                  <ListItem
                    button
                    onClick={() => handleMainTabChange(item)}
                    sx={{
                      backgroundColor: '#3a3b3c',
                      '&:hover': {
                        backgroundColor: '#5a5a5a',
                      },
                      ...(activeMainTab === item.id && {
                        backgroundColor: '#4a4a4a',
                        borderLeft: '4px solid #507dac',
                      })
                    }}
                  >
                    <ListItemText
                      primary={item.text}
                      sx={{ color: 'white' }}
                      primaryTypographyProps={{ fontSize: '0.9em' }}
                    />
                    {item.children && (
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMainTabChange(item);
                        }}
                      >
                        {expandedMainTabs[item.id] ? <ExpandLessIcon sx={{ color: 'white' }} /> : <ExpandMoreIcon sx={{ color: 'white' }} />}
                      </IconButton>
                    )}
                  </ListItem>
                  {expandedMainTabs[item.id] && item.children && (
                    <List component="div" disablePadding>
                      {item.children.map(subItem => (
                        <React.Fragment key={subItem.id}>
                          <ListItem
                            button
                            onClick={() => handleSubTabChange(subItem)}
                            sx={{
                              pl: 4,
                              backgroundColor: '#3a3b3c',
                              '&:hover': {
                                backgroundColor: '#5a5a5a'
                              },
                              ...(activeSubTab === subItem.id && {
                                backgroundColor: '#4a4a4a',
                                borderLeft: '4px solid #507dac',
                                fontWeight: 'bold'
                              })
                            }}
                          >
                            <ListItemText
                              primary={subItem.text}
                              sx={{ color: 'white' }}
                              primaryTypographyProps={{ fontSize: '0.9em' }}
                            />
                            {subItem.children && (
                              <IconButton
                                edge="end"
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSubTabChange(subItem);
                                }}
                              >
                                {activeSubTab === subItem.id && subItem.children.length ? <ExpandLessIcon sx={{ color: 'white' }} /> : <ExpandMoreIcon sx={{ color: 'white' }} />}
                              </IconButton>
                            )}
                          </ListItem>
                          {activeSubTab === subItem.id && subItem.children && (
                            <List component="div" disablePadding>
                              {subItem.children.map(subSubItem => (
                                <ListItem
                                  button
                                  key={subSubItem.id}
                                  onClick={() => handleSubSubTabChange(subSubItem)}
                                  sx={{
                                    pl: 8,
                                    backgroundColor: '#3a3b3c',
                                    '&:hover': {
                                      backgroundColor: '#5a5a5a'
                                    },
                                    ...(activeSubSubTab === subSubItem.id && {
                                      backgroundColor: '#4a4a4a',
                                      borderLeft: '4px solid #507dac',
                                      fontWeight: 'bold'
                                    })
                                  }}
                                >
                                  <ListItemText
                                    primary={subSubItem.text}
                                    sx={{ color: 'white' }}
                                    primaryTypographyProps={{ fontSize: '0.85em' }}
                                  />
                                </ListItem>
                              ))}
                            </List>
                          )}
                        </React.Fragment>
                      ))}
                    </List>
                  )}
                </React.Fragment>
              ))}
            </List>
          </Box>
        </Box>
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: '#f5f5f5', p: 3 }}
        >
          <Toolbar />
          <Box sx={{ position: 'relative', width: '100%' }}>
            {isLoading && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <CircularProgress />
              </Box>
            )}
            {children}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default NestedList;