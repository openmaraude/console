/* eslint-disable react/forbid-prop-types */

import React from 'react';
import PropTypes from 'prop-types';

import Head from 'next/head';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  getCurrentUser,
  login,
  logout as doLogout,
  UserContext,
} from '@/src/auth';
import LoginForm from '@/components/Login';
import Menu from '@/components/Menu';
import theme from '@/components/theme';
import '@/styles/styles.css';
import createEmotionCache from '@/src/createEmotionCache';

const cache = createEmotionCache();

export default function ConsoleApp({ Component, pageProps }) {
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  const [user, setUser] = React.useState();

  // If user is already login, reload view with it.
  React.useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const providerValue = React.useMemo(() => {
    const authenticate = async (form) => setUser(await login(form));
    const logout = () => setUser(doLogout());
  
    return { user, authenticate, logout }
  }, [user]);

  return (
    <>
      <Head>
        <title>Console le.taxi</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <CacheProvider value={cache}>
        <ThemeProvider theme={theme}>
          <CssBaseline />

          <ToastContainer
            position="top-right"
            autoClose={5000}
            newestOnTop
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />

          <UserContext.Provider value={providerValue}>
            <Menu />
            {
              user || pageProps.optionalAuth
                ? <Component {...pageProps} />
                : <LoginForm />
            }
          </UserContext.Provider>
        </ThemeProvider>
      </CacheProvider>
    </>
  );
}

ConsoleApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
