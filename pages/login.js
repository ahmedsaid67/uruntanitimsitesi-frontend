import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { submitLogin } from '../context/features/auth/loginSlice';
import Head from 'next/head';
import styles from '../styles/Login.module.css'; // Import the styles

const Login = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Yeni state ekleniyor
  const router = useRouter();
  const isAuthenticated = useSelector((state) => state.login.success);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleShowPasswordChange = () => {
    setShowPassword(!showPassword); // Şifreyi göster/gizle
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(submitLogin(username, password));
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (router.query && router.query.from) {
        router.push(router.query.from);
      } else {
        router.push("/panel/ana-sayfa/");
      }
    }
  }, [isAuthenticated, router]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Admin Giriş | ASD</title>

      </Head>
      <div className={styles.login}>
        <h1 className={styles.title}>Giriş Yap</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputContainer}>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Kullanıcı Adı"
              value={username}
              onChange={handleUsernameChange}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.inputContainer}>
            <input
              type={showPassword ? 'text' : 'password'} // Dinamik tür ataması
              id="password"
              name="password"
              placeholder="Şifre"
              value={password}
              onChange={handlePasswordChange}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.inputContainer}>
            <label>
              <input
                type="checkbox"
                checked={showPassword}
                onChange={handleShowPasswordChange}
              /> Şifreyi Göster
            </label>
          </div>
          <button type="submit" className={styles.button}>Giriş Yap</button>
        </form>
      </div>
    </div>
  );
};

export default Login;



