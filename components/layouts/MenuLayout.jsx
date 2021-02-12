/*
 * Layout to display a menu on the left, and content on the right.
 */
import React from 'react';
import PropTypes from 'prop-types';

import Link from 'next/link';
import { useRouter } from 'next/router';

import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import { fade, makeStyles } from '@material-ui/core/styles';

import { ButtonLink } from '../LinksRef';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),

    minHeight: '80vh',

    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },

  menu: {
    borderRight: `1px solid ${theme.palette.divider}`,
    width: '250px',
    minWidth: '250px',
    marginBottom: theme.spacing(3),
  },

  activeMenuItem: {
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: fade(theme.palette.info.light, 0.15),
  },

  content: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
}));

export function Menu({ children }) {
  const classes = useStyles();
  return <div className={classes.menu}>{children}</div>;
}

Menu.propTypes = {
  children: PropTypes.node.isRequired,
};

export function MenuItem({ title, href }) {
  const classes = useStyles();
  const router = useRouter();

  return (
    <Link href={href} passHref>
      <ButtonLink className={router.pathname === href ? classes.activeMenuItem : null}>
        {title}
      </ButtonLink>
    </Link>
  );
}

MenuItem.propTypes = {
  title: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
};

export function Content({ children }) {
  const classes = useStyles();
  return <div className={classes.content}>{ children }</div>;
}

Content.propTypes = {
  children: PropTypes.node.isRequired,
};

export function MenuLayout({ children }) {
  const classes = useStyles();
  return (
    <Container maxWidth="lg">
      <Paper className={classes.paper} elevation={10}>
        { children }
      </Paper>
    </Container>
  );
}

MenuLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
