import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AppBar, Box,Toolbar,Divider, IconButton, Typography, List, ListItem, ListItemText, Drawer, CssBaseline } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import styles from '../styles/Sidebar.module.css';
import { useSelector,useDispatch } from 'react-redux';
import { submitLogout } from '../context/features/auth/loginSlice';
import CircularProgress from '@mui/material/CircularProgress';
import { faAddressCard,  faCircleInfo, faFile, faHandshake, faHashtag, faHouse, faImage, faLink, faList, faMap, faSliders } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const drawerWidth = 240;

const MenuListItems = [
  {
    id: 1,
     text: <><span className={styles.icon}><FontAwesomeIcon icon={faHouse} /></span> Ana Sayfa</>,
    url: '/panel/ana-sayfa',
  },
  {
    id: 2,
     text: <><span className={styles.icon}><FontAwesomeIcon icon={faList} /></span> Menü</>,
    url: '/panel/menu',
  },
  {
    id: 3,
    text: <><span className={styles.icon}><FontAwesomeIcon icon={faSliders} /></span> Banner</>,
    url: '/panel/sliders',
  },
  {
    id: 4,
    text: <><span className={styles.icon}><FontAwesomeIcon icon={faHashtag} /></span> Sosyal Medya</>,
    url: '/panel/sosyal-medya',
  },
  {
    id: 5,
    text: <><span className={styles.icon}><FontAwesomeIcon icon={faLink} /></span> Hızlı Linkler</>,
    url: '/panel/hizli-linkler',
  },
  {
    id: 6,
    text: <><span className={styles.icon}><FontAwesomeIcon icon={faImage} /></span> Başlık Görsel</>,
    url: '/panel/baslik-gorsel',
  },
  {
    id: 7,
    text: <><span className={styles.icon}><FontAwesomeIcon icon={faHandshake} /></span> Başlık Görsel</>,
    url: '/panel/references',
  },
  {
    id: 8,
    text:  <><span className={styles.icon}><FontAwesomeIcon icon={faFile} /></span> Ürünler</>,

    children: [
      { id: 81, text: 'Ürün Kategori', url: '/panel/urunler/urun-kategori' },
      { id: 82, text: 'Ürün Vitrin', url: '/panel/urunler/urun-vitrin' },
      { id: 83, text: 'Ürünler', url: '/panel/urunler/urunler' },
    ],
  },
  {
    id:9,
    text:  <><span className={styles.icon}><FontAwesomeIcon icon={faAddressCard} /></span> İlteişim</>,
    url: '/panel/iletisim',
  },
  {
    id:10,
    text:  <><span className={styles.icon}><FontAwesomeIcon icon={faCircleInfo} /></span> Hakkımızda</>,
    url: '/panel/hakkimizda',
  }
];





function NestedList({ children }) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMainTab, setActiveMainTab] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState(null);
  const [activeSubSubTab, setActiveSubSubTab] = useState(null);
  const [selectedSubItems, setSelectedSubItems] = useState([]);
  const [selectedSubSubItems, setSelectedSubSubItems] = useState([]);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const handleStart = (url) => setIsLoading(true);
    const handleComplete = (url) => setIsLoading(false);

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
    // URL yolu üzerinden aktif öğeleri belirle
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
  
    // Bulunan aktif öğelere göre state'i güncelle
    if (activeMainItem) {
      setActiveMainTab(activeMainItem.id);
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


  const logout=()=>{
    dispatch(submitLogout())
  }


  


  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMainTabChange = (item) => {
    setActiveMainTab(item.id);
    setSelectedSubItems(item.children || []);
  
    if (item.children && item.children.length > 0) {
      // İlk alt öğeyi aktif yap
      const firstSubItem = item.children[0];
      setActiveSubTab(firstSubItem.id);
      setSelectedSubSubItems(firstSubItem.children || []);
  
      // İlk alt öğenin alt öğeleri varsa, onların da ilkini aktif yap
      if (firstSubItem.children && firstSubItem.children.length > 0) {
        setActiveSubSubTab(firstSubItem.children[0].id);
      } else {
        setActiveSubSubTab(null);
      }
  
      // Yönlendirme işlemi
      if (firstSubItem.url) {
        router.push(firstSubItem.url);
      } else if (firstSubItem.children && firstSubItem.children.length > 0 && firstSubItem.children[0].url) {
        router.push(firstSubItem.children[0].url);
      }
    } else {
      if (item.url) {
        router.push(item.url);
      }
      // Alt öğeler için aktiflikleri temizle
      setActiveSubTab(null);
      setSelectedSubSubItems([]);
    }
  };
  
  
  const handleSubTabChange = (subItem, parentItemId) => {
    // Mevcut aktif alt öğeyi ve alt-alt öğelerini güncelle
    setActiveSubTab(subItem.id);
    setSelectedSubSubItems(subItem.children || []);
    // Mevcut aktif ana öğeyi güncelle
    if (parentItemId && parentItemId !== activeMainTab) {
      setActiveMainTab(parentItemId);
      const parentItem = MenuListItems.find(item => item.id === parentItemId);
      setSelectedSubItems(parentItem.children || []);
    }
    // İlk alt-alt öğeyi aktif yap
    if (subItem.children && subItem.children.length > 0) {
      setActiveSubSubTab(subItem.children[0].id);
      // İlk alt-alt öğenin sayfasına yönlendir
      if (subItem.children[0].url) {
        router.push(subItem.children[0].url);
      }
    } else {
      // Alt-alt öğeler yoksa, mevcut alt öğenin sayfasına yönlendir
      if (subItem.url) {
        setActiveSubSubTab(null);
        router.push(subItem.url);
      }
    }
  };
  
  
  const handleSubSubTabChange = (subSubItem) => {
    setActiveSubSubTab(subSubItem.id);
    
    // Alt-alt öğenin ebeveynini bul
    const parentSubItem = selectedSubItems.find(item => item.children?.some(child => child.id === subSubItem.id));
    if (parentSubItem) {
      setActiveSubTab(parentSubItem.id);
  
      // Eğer bu alt öğenin de ebeveyni varsa onu da bul ve aktif yap
      const mainParentItem = MenuListItems.find(item => item.children?.some(child => child.id === parentSubItem.id));
      if (mainParentItem) {
        setActiveMainTab(mainParentItem.id);
      }
    }
  
    // Yönlendirme
    if (subSubItem.url) {
      router.push(subSubItem.url);
    }
  };



  


  

  const renderSubItems = () => (
    
    <Box sx={{ width: drawerWidth }}>
      <Typography 
        variant="h6" // Daha büyük bir başlık boyutu
        noWrap
        component="div"
        style={{
          fontWeight: 'bold', // Kalın yazı tipi
          color: '#1976d2', // Dikkat çekici bir renk
          fontSize: "16px",
          marginBottom:"20px",
          marginTop:"20px",

        }}
      >
        {activeMainTab && MenuListItems.find(item => item.id === activeMainTab).text}
      </Typography>
      <List>
        {selectedSubItems.map((subItem) => (
          <React.Fragment key={subItem.id}>
            <ListItem 
              
              onClick={() => handleSubTabChange(subItem)}
              className={styles.nested}
            >
              <ListItemText 
                primary={
                  <Typography 
                    variant="subtitle1" 
                    style={{ 
                      color: activeSubTab === subItem.id ? '#000000' : 'inherit', // Seçili ise koyu renk
                      fontWeight: activeSubTab === subItem.id ? '700' : 'normal', // Seçili ise kalın font
                      fontSize: "14px",
                    }}
                  >
                    {subItem.text}
                  </Typography>
                }
              />
            </ListItem>
            <List component="div" disablePadding className={styles.nestedList}>
              {subItem.children?.map((subSubItem) => (
                <ListItem 
                  key={subSubItem.id}
                  onClick={() => handleSubSubTabChange(subSubItem)}
                  className={styles.nestedSubList}
                >
                  <ListItemText 
                    primary={
                      <Typography 
                        variant="subtitle1" 
                        style={{ 
                          color: activeSubSubTab === subSubItem.id ? '#000000' : 'inherit', // Seçili ise koyu renk
                          fontWeight: activeSubSubTab === subSubItem.id ? '700' : 'normal', // Seçili ise kalın font
                          fontSize: "14px",
                        }}
                      >
                        {subSubItem.text}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </React.Fragment>
        ))}
      </List>
    </Box>
    
    
  );




  
  

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ marginRight: 2, display: { sm: 'none' } }}
          >
            
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            ASD Panel
          </Typography>
          <IconButton
            color="inherit"
            aria-label="logout"
            onClick={logout}
          >
            <LogoutIcon/>
          </IconButton>
        </Toolbar>
      </AppBar>
      <div className={styles.sidebar}>
        <div className={styles.toolbar}></div>
        <div className={styles.drawerContent}>
          <ul className={styles.menuList}>
            {MenuListItems.map((item) => (
              <li
                key={item.id}
                className={`${styles.menuItem} ${activeMainTab === item.id ? styles.active : ''}`}
                onClick={() => handleMainTabChange(item)}
              >
                {item.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Box component="main" sx={{ flexGrow: 1 }}>
      <Toolbar />
      <div className={styles.rightbar}>
        <div className={styles.tabContainer}>
          {renderSubItems()}
        </div>

        <div className={isLoading ? styles.contentLoading : styles.content}>
          {isLoading ? (
            <div className={styles.contentLoading}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
              </div>
            </div>
          ) : 
            <div className={styles.content} > 
                {children}
            </div>
            }
        </div>

      </div>
    </Box>
    </Box>
  );
}

export default NestedList;