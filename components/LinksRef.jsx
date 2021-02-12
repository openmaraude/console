/*
 * https://nextjs.org/docs/api-reference/next/link#if-the-child-is-a-function-component
 */

import React from 'react';

import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';

export const ButtonLink = React.forwardRef(({ onClick, href, children, ...props}, ref) => {
  return (
    <Button href={href} onClick={onClick} ref={ref} {...props}>
      { children }
    </Button>
  );
});

export const TextLink = React.forwardRef(({ onClick, href, children, ...props}, ref) => {
  return (
    <Link href={href} onClick={onClick} ref={ref} {...props}>
      { children }
    </Link>
  );
});
