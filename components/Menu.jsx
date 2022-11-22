import React from 'react';
import PropTypes from 'prop-types';

import Link from 'next/link';
import { useRouter } from 'next/router';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { makeStyles } from 'tss-react/mui';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';

import { getAuthenticatedUsers, hasRole, UserContext } from '@/src/auth';

const useStyles = makeStyles()((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),

    // Hide by default.
    display: 'none',

    // Only display menu button on mobile
    [theme.breakpoints.down('sm')]: {
      display: 'block',
    },
  },

  consoleButton: {
    color: theme.palette.primary.contrastText,
    fontWeight: 'bold',
    fontSize: '1.3em',
  },

  titleBox: {
    flexGrow: 1,
  },

  toolbar: {
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },

  menuItems: {
    // Hide on mobile
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },

  menuItemsExpanded: {
    // Expanded menu on mobile
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },

  loggedAs: {
    backgroundColor: theme.palette.warning.main,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  menu: {
    color: theme.palette.primary.contrastText,
  },

  currentMenu: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
}));

function AuthenticatedUser() {
  const userContext = React.useContext(UserContext);
  const { classes } = useStyles();

  return (
    <div className={classes.loggedAs}>
      Connecté en tant que {userContext.user.name || userContext.user.email}
    </div>
  );
}

function HighlightedLink({ href, ...props }) {
  const router = useRouter();
  const { classes, cx } = useStyles();

  // Only get the first part of the URL, until the first slash.
  //
  // /account returns /account
  // /documentation/search returns /documentation
  const firstLevelHref = href.match(/^\/[^/]+/)[0];
  const firstLevelRouter = router.pathname.match(/^\/[^/]+/)?.[0];

  return (
    <Link
      href={href}
      className={cx(classes.menu, firstLevelHref === firstLevelRouter && classes.currentMenu)}
      {...props}
    />
  );
}

HighlightedLink.propTypes = {
  href: PropTypes.string.isRequired,
};

export default function Menu() {
  const userContext = React.useContext(UserContext);
  const { classes } = useStyles();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [authenticatedUsers, setAuthenticatedUsers] = React.useState([]);

  React.useEffect(
    () => async () => setAuthenticatedUsers(getAuthenticatedUsers()),
    [userContext.user],
  );

  const handleMenuToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <AppBar position="static">
      <Toolbar className={classes.toolbar}>

        <Box className={classes.titleBox} display="flex" alignItems="center">
          <IconButton onClick={handleMenuToggle} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>

          <Link href="/dashboards">
            <Button color="inherit" className={classes.consoleButton}>Console</Button>
          </Link>
        </Box>

        <Box display="flex" className={mobileOpen ? classes.menuItemsExpanded : classes.menuItems}>
          {userContext.user && (
            <>
              {
                hasRole(userContext.user, 'admin')
                && (
                <>
                  <HighlightedLink href="/admin">
                    <Button color="inherit">Administration</Button>
                  </HighlightedLink>
                  <HighlightedLink href="/stats">
                    <Button color="inherit">Statistiques</Button>
                  </HighlightedLink>
                </>
                )
              }
              <HighlightedLink href="/dashboards">
                <Button color="inherit">Tableaux de bord</Button>
              </HighlightedLink>
            </>
          )}

          {
            (userContext.user?.managed.length > 0 && !hasRole(userContext.user, 'admin'))
            && (
              <HighlightedLink href="/manager">
                <Button color="inherit">Comptes en gestion</Button>
              </HighlightedLink>
            )
          }

          <HighlightedLink href="/documentation">
            <Button color="inherit">Documentation</Button>
          </HighlightedLink>

          {userContext.user && process.env.INTEGRATION_ENABLED && (
            <HighlightedLink href="/integration">
              <Button color="inherit">Intégration</Button>
            </HighlightedLink>
          )}

          {userContext.user && (
            <>
              <HighlightedLink href="/account">
                <Button color="inherit">Mon compte</Button>
              </HighlightedLink>

              <Button onClick={userContext.logout} color="inherit">Déconnexion</Button>
            </>
          )}
        </Box>
      </Toolbar>

      {
        authenticatedUsers.length > 1 && <AuthenticatedUser />
      }
    </AppBar>
  );
}
