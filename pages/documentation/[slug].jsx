import PropTypes from 'prop-types';

import dynamic from 'next/dynamic';
import Link from 'next/link';

import { makeStyles } from '@material-ui/core/styles';

import SyntaxHighlighter from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

import { MDXProvider } from '@mdx-js/react';
import Slugger from 'github-slugger';

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

const useStyles = makeStyles(() => ({
  hr: {
    border: 0,
    height: 0,
    borderTop: '1px solid rgba(0, 0, 0, 0.1)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
  },
  sideNote: {
    textAlign: 'right',
    fontStyle: 'italic',
    fontSize: '0.9em',
    padding: 0,
    margin: 0,
  },
}));

function StyledHr() {
  const classes = useStyles();
  return <hr className={classes.hr} />;
}

const ALL_PAGES = [
  { title: 'Introduction', slug: 'introduction' },
  { title: 'Tutoriels', slug: 'tutorials' },
  { title: 'Guides thématiques', slug: 'topic_guides' },
  { title: 'Guides de référence', slug: 'reference_guides' },
  { title: 'Guides pratiques', slug: 'howto_guides' },
];

const slugger = new Slugger();

const Heading = ({ variant, children }) => {
  const slug = slugger.slug(children);
  return (
    <Typography variant={variant} id={slug}>
      {children}
      <a href={`#${slug}`} title="Permalink" className="headinglink">¶</a>
    </Typography>
  );
};

Heading.propTypes = {
  variant: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

function SideNote({ children }) {
  const classes = useStyles();
  return (
    <p className={classes.sideNote}>{ children }</p>
  );
}

SideNote.propTypes = {
  children: PropTypes.node.isRequired,
};

/* eslint-disable react/prop-types */
const components = {
  h1: ({ children }) => <Heading variant="h1">{children}</Heading>,
  h2: ({ children }) => <Heading variant="h2">{children}</Heading>,
  h3: ({ children }) => <Heading variant="h3">{children}</Heading>,
  h4: ({ children }) => <Heading variant="h4">{children}</Heading>,
  h5: ({ children }) => <Heading variant="h5">{children}</Heading>,
  h6: ({ children }) => <Heading variant="h6">{children}</Heading>,

  code: ({ className, children }) => {
    const language = className.replace(/language-/, '');
    return (
      <SyntaxHighlighter style={dark} language={language} wrapLongLines>
        {children}
      </SyntaxHighlighter>
    );
  },

  SideNote,

  table: ({ children }) => <Table>{children}</Table>,
  thead: ({ children }) => <TableHead>{children}</TableHead>,
  tbody: ({ children }) => <TableBody>{children}</TableBody>,
  tr: ({ children }) => <TableRow>{children}</TableRow>,
  th: ({ children }) => <TableCell>{children}</TableCell>,
  td: ({ children }) => <TableCell>{children}</TableCell>,
  a: ({ href, children }) => <Link href={href} passHref><TextLink>{children}</TextLink></Link>,
  hr: () => <StyledHr />,
};
/* eslint-enable react/prop-types */

export default function Introduction({ slug }) {
  const validSlug = ALL_PAGES
    .filter((page) => page.slug === slug)
    ?.[0]
    ?.slug || ALL_PAGES[0].slug;

  const MDXDocument = dynamic(() => import(`../../public/documentation/${validSlug}.mdx`));

  return (
    <MenuLayout>
      <Menu>
        {ALL_PAGES.map((page) => <MenuItem key={page.slug} title={page.title} href={`/documentation/${page.slug}`} />)}
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

export async function getStaticProps(context) {
  return {
    props: {
      slug: context.params.slug,
      optionalAuth: true,
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: ALL_PAGES.map((page) => ({ params: { slug: page.slug } })),
    fallback: false,
  };
}
