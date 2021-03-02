/*
 * https://nextjs.org/docs/api-reference/next/link#if-the-child-is-a-function-component
 */

import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';

export const ButtonLink = React.forwardRef(({
  onClick,
  href,
  children,
  ...props
},
ref) => (
  <Button href={href} onClick={onClick} ref={ref} {...props}>
    { children }
  </Button>
));

ButtonLink.defaultProps = {
  onClick: undefined,
  href: undefined,
  children: undefined,
};

ButtonLink.propTypes = {
  onClick: PropTypes.func,
  href: PropTypes.string,
  children: PropTypes.node,
};

export const TextLink = React.forwardRef(({
  onClick,
  href,
  children,
  ...props
},
ref) => (
  <Link href={href} onClick={onClick} ref={ref} {...props}>
    { children }
  </Link>
));

TextLink.defaultProps = {
  onClick: undefined,
  href: undefined,
  children: undefined,
};

TextLink.propTypes = {
  onClick: PropTypes.func,
  href: PropTypes.string,
  children: PropTypes.node,
};
