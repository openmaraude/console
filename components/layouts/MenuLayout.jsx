/*
 * Layout to display a menu on the left, and content on the right.
 */
import React from 'react';
import PropTypes from 'prop-types';

import Link from 'next/link';
import { useRouter } from 'next/router';

import { fade, makeStyles } from '@material-ui/core/styles';

import BaseLayout from './BaseLayout';
import { ButtonLink } from '../LinksRef';

const useStyles = makeStyles((theme) => ({
  paper: {
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },

  menu: {
    borderRight: `1px solid ${theme.palette.divider}`,
    paddingRight: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },

  menuItem: {
  },

  activeMenuItem: {
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: fade(theme.palette.info.light, 0.15),
  },

  content: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    flex: 1,
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
    <div>
      <Link href={href} passHref>
        <ButtonLink className={router.asPath === href ? classes.activeMenuItem : classes.menuItem}>
          {title}
        </ButtonLink>
      </Link>
    </div>
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

export function MenuLayout({ children, ...props }) {
  const classes = useStyles();
  return (
    <BaseLayout maxWidth="lg" paperClassName={classes.paper} {...props}>
      { children }
    </BaseLayout>
  );
}

MenuLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
