/*
 * Layout to display a menu on the left, and content on the right.
 */
import React from 'react';
import PropTypes from 'prop-types';

import Link from 'next/link';
import { useRouter } from 'next/router';

import clsx from 'clsx';

import { makeStyles } from '@mui/styles';
import { alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';

import BaseLayout from '@/components/layouts/BaseLayout';

const useStyles = makeStyles((theme) => ({
  paper: {
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },

  menu: {
    borderRight: 'none',
    borderBottom: `1px solid ${theme.palette.divider}`,
    minWidth: '100px',

    [theme.breakpoints.up('md')]: {
      borderRight: `1px solid ${theme.palette.divider}`,
      borderBottom: 'none',
    },
    paddingRight: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    marginBottom: theme.spacing(3),
    flexShrink: 0,
  },

  menuItem: {
    color: alpha('#000', 0.87), // Value from MUI 4.x
  },

  activeMenuItem: {
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: alpha(theme.palette.info.light, 0.15),
  },

  secondaryMenuItem: {
    fontSize: '0.8em',
    marginLeft: theme.spacing(2),
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

export function MenuItem({ title, href, secondary }) {
  const classes = useStyles();
  const router = useRouter();

  return (
    <div>
      <Link href={href}>
        <Button className={clsx(
          classes.menuItem,
          router.asPath === href && classes.activeMenuItem,
          secondary && classes.secondaryMenuItem,
        )}
        >
          {title}
        </Button>
      </Link>
    </div>
  );
}

MenuItem.defaultProps = {
  secondary: false,
};

MenuItem.propTypes = {
  title: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  secondary: PropTypes.bool,
};

export function Content({ loading, children }) {
  const classes = useStyles();
  return (
    <div className={classes.content}>
      {loading ? <LinearProgress /> : children}
    </div>
  );
}

Content.defaultProps = {
  children: null,
  loading: false,
};

Content.propTypes = {
  children: PropTypes.node,
  loading: PropTypes.bool,
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
