import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import useWindowSize from './useWindowSize';
import axios from 'axios';
import styles from '../styles/Navbar.module.css';
import { API_ROUTES } from '@/utils/constants';

const Navbar = () => {
    const [width] = useWindowSize();
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const [isMobileState, setIsMobileState] = useState(null);
    const [urunler,setUrunler] = useState([])

    useEffect(() => {
        if (width <= 1024) {
            setIsMobileState(true);
        } else {
            setIsMobileState(false);
        }
    }, [width]);

    // Fetch data from API endpoints
    const fetchData = async () => {
        try {
            const response = await axios.get(API_ROUTES.URUN_KATEGORI_LIST)
            setUrunler(response.data)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const toggleMenu = () => setMenuOpen(!menuOpen);

    const handleMenuClick = (menu) => {
        if (activeMenu === menu) {
            setActiveMenu(null); // Close menu
        } else {
            setActiveMenu(menu); // Open selected menu
        }
    };



    return (
        <div className={styles.navbarContainer}>
            <Link href="/"><div className={styles.logoContainer}>FlexSoft</div></Link>

            {isMobileState && !menuOpen && (
                <div className={styles.hamburgerContainer} onClick={toggleMenu}>
                    <FaBars />
                </div>
            )}

            {isMobileState && menuOpen && (
                <div className={styles.mobileMenuOverlay}>
                    <div className={styles.mobileMenuContent}>
                        <div className={styles.closeIconContainer}>
                            {activeMenu === null ? (
                                <>
                                    <div className={styles.logoContainer}>FlexSoft</div>
                                    <div className={styles.hamburgerContainer} onClick={toggleMenu}>
                                        <FaTimes />
                                    </div>
                                </>
                            ) : (
                                <div
                                    className={styles.hamburgerContainer}
                                    onClick={() => setActiveMenu(null)}
                                >
                                    <FaChevronLeft />
                                </div>
                            )}
                        </div>
                        <div className={styles.mobilMenuItemContainer}
                          
                        >
                            {/* Main Menu */}
                            {activeMenu === null && (
                                <>
                                    <Link href='/' onClick={() => setMenuOpen(false)}>
                                        <p>Ana Sayfa</p>
                                    </Link>
                                    <p onClick={() => handleMenuClick('urunlerimiz')}>
                                        Ürünlerimiz <FaChevronRight />
                                    </p>
                                    <Link href='/referanslar' onClick={() => setMenuOpen(false)}>
                                        <p>Referanslar</p>
                                    </Link>
                                    <Link href='/hakkimizda' onClick={() => setMenuOpen(false)}>
                                        <p>Hakkımızda</p>
                                    </Link>
                                    <Link href='/iletisim' onClick={() => setMenuOpen(false)}>
                                        <p>İletişim</p>
                                    </Link>
                                </>
                            )}
                            {/* "İlaçlar" Sub Menu */}
                            {activeMenu === 'urunlerimiz' &&
                                urunler.map((item) => (
                                    <Link
                                        href={`/urunlerimiz?tab=${item.slug}`}
                                        key={item.id}
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        <p>{item.baslik}</p>
                                    </Link>
                                ))}
                        </div>

                    </div>
                </div>
            )}

            {!isMobileState && (
                <div className={styles.itemContainer}>
                    <div>
                        <Link href='/'><p>Ana Sayfa</p></Link>
                    </div>
                    <div className={styles.menuItem}>
                        <Link href={`/urunlerimiz`}><p>Ürünlerimiz</p></Link>
                        <div className={styles.dropdown}>
                            {urunler
                                .map((item) => (
                                    <Link href={`/urunlerimiz?tab=${item.slug}`} key={item.id}>
                                        <p>{item.baslik}</p>
                                    </Link>
                                ))}
                        </div>
                    </div>
                    <div>
                        <Link href='/referanslar'><p>Referanslar</p></Link>
                    </div>
                    <div>
                        <Link href='/hakkimizda'><p>Hakkımızda</p></Link>
                    </div>
                    <div>
                        <Link href='/iletisim'><p>İletişim</p></Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;
