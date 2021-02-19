import PropTypes from 'prop-types';

import dynamic from 'next/dynamic';
import Link from 'next/link';

import SyntaxHighlighter from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

import { MDXProvider } from '@mdx-js/react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import {
  MenuLayout,
  Content,
  Menu,
  MenuItem,
} from '../../components/layouts/MenuLayout';
import { TextLink } from '../../components/LinksRef';

/* eslint-disable react/prop-types */
const components = {
  h1: ({ children }) => <Typography variant="h1">{children}</Typography>,
  h2: ({ children }) => <Typography variant="h2">{children}</Typography>,
  h3: ({ children }) => <Typography variant="h3">{children}</Typography>,
  h4: ({ children }) => <Typography variant="h4">{children}</Typography>,
  h5: ({ children }) => <Typography variant="h5">{children}</Typography>,
  h6: ({ children }) => <Typography variant="h6">{children}</Typography>,

  code: ({ className, children }) => {
    const language = className.replace(/language-/, '');
    return (
      <SyntaxHighlighter style={dark} language={language} wrapLongLines>
        {children}
      </SyntaxHighlighter>
    );
  },

  table: ({ children }) => <Table>{children}</Table>,
  thead: ({ children }) => <TableHead>{children}</TableHead>,
  tbody: ({ children }) => <TableBody>{children}</TableBody>,
  tr: ({ children }) => <TableRow>{children}</TableRow>,
  th: ({ children }) => <TableCell>{children}</TableCell>,
  td: ({ children }) => <TableCell>{children}</TableCell>,
  a: ({ href, children }) => <Link href={href} passHref><TextLink>{children}</TextLink></Link>,
};
/* eslint-enable react/prop-types */

export default function Introduction({ slug }) {
  const MDXDocument = dynamic(() => import(`../../public/documentation/${slug}.mdx`));

  return (
    <MenuLayout>
      <Menu>
        <MenuItem title="Introduction" href="/documentation/introduction" />
        <MenuItem title="Moteur de recherche" href="/documentation/search" />
        <MenuItem title="Opérateur" href="/documentation/operator" />
        <MenuItem title="Documentation de référence" href="/documentation/reference" />
        <MenuItem title="Exemples" href="/documentation/examples" />
      </Menu>
      <Content>
        <MDXProvider components={components}>
          <MDXDocument />
        </MDXProvider>
      </Content>
    </MenuLayout>
  );
}
Introduction.propTypes = {
  slug: PropTypes.string.isRequired,
};

export async function getStaticProps({ params }) {
  return {
    props: {
      optionalAuth: true,
      slug: params.slug,
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: [
      { params: { slug: 'introduction' } },
      { params: { slug: 'search' } },
      { params: { slug: 'operator' } },
      { params: { slug: 'reference' } },
      { params: { slug: 'examples' } },
    ],
    fallback: false,
  };
}
