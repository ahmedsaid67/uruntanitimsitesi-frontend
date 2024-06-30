import styles from "./iletisim.module.css";

const Iletisim = () =>{
    return(
        <div>
            <h2>İletisim</h2>

            <div className={styles.mainContainer}>
                <div className={styles.detail}>
                    <h2>E-mail</h2>
                    <p>Fatih Keles</p>
                </div>
                <div className={styles.detail}>
                    <h2>Adres</h2>
                    <p>Pazariçi</p>
                </div>
                <div className={styles.detail}>
                    <h2>Telefon</h2>
                    <p>05065320230</p>
                </div>
                <div className={styles.detail}>
                    <h2>Sosyal Medya</h2>
                    <div className={styles.socialMedia}>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                            <img src="/path/to/twitter-icon.png" alt="Twitter" className={styles.icon} />
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            <img src="/path/to/facebook-icon.png" alt="Facebook" className={styles.icon} />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                            <img src="/path/to/instagram-icon.png" alt="Instagram" className={styles.icon} />
                        </a>
                    </div>
                </div>
            </div>

            <div className={styles.map}>
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1504.250113643521!2d28.9210027661942!3d41.05805709525544!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e1d1224d96a7119%3A0x8cbe1c9940dac826!2sGaziosmanpa%C5%9Fa%20Monavet%20Veteriner%20Klini%C4%9Fi!5e0!3m2!1str!2str!4v1719593685137!5m2!1str!2str" 
                    width="600" 
                    height="450" 
                    style={{ border: 0 }} 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>
        </div>
    )
}

export default Iletisim;
