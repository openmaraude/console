/* eslint-disable react/forbid-prop-types */

import React from 'react';
import PropTypes from 'prop-types';

import App from 'next/app';
import Head from 'next/head';

import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';

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
} from '../src/auth';
import LoginForm from '../components/Login';
import Menu from '../components/Menu';
import theme from '../components/theme';

export default function ConsoleApp({ Component, pageProps, initialUser }) {
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  const [user, setUser] = React.useState(initialUser);

  const authenticate = async (form) => setUser(await login(form));
  const logout = () => setUser(doLogout());

  return (
    <>
      <Head>
        <title>Console le.taxi</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
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

        <UserContext.Provider value={{ user, authenticate, logout }}>
          <Menu />
          {
            user || pageProps.optionalAuth
              ? <Component {...pageProps} />
              : <LoginForm />
          }
        </UserContext.Provider>
      </ThemeProvider>
    </>
  );
}

ConsoleApp.getInitialProps = async (appContext) => {
  const user = getCurrentUser(appContext.ctx);
  const appProps = await App.getInitialProps(appContext);

  return { initialUser: user, ...appProps };
};

ConsoleApp.defaultProps = {
  initialUser: null,
};

ConsoleApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
  initialUser: PropTypes.object,
};
