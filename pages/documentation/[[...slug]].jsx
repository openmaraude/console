import React from 'react';
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
} from '@/components/layouts/MenuLayout';
import { TextLink } from '@/components/LinksRef';

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
  centeredImage: {
    textAlign: 'center',

    '& img': {
      border: '1px solid #eee',
      borderRadius: '20px',
      width: '85%',
      height: 'auto',
    },
  },
  inlineCode: {
    backgroundColor: dark.hljs.background,
    color: dark.hljs.color,
    paddingTop: '2px',
    paddingBottom: '2px',
    paddingLeft: '5px',
    paddingRight: '5px',
    borderRadius: '20px',
    margin: '2px',
    display: 'inline-block',
  },
}));

function StyledHr() {
  const classes = useStyles();
  return <hr className={classes.hr} />;
}

const ALL_PAGES = [
  { title: 'Introduction', slug: 'introduction', hide: true },
  {
    title: 'Tutoriels',
    slug: 'tutorials',
    submenus: [
      { title: 'Créer une application chauffeur', slug: 'create_driver_app' },
      { title: 'Créer une application client', slug: 'create_client_app' },
    ],
  },
  {
    title: 'Guides thématiques',
    slug: 'topic_guides',
    submenus: [
      { title: 'Importance de poll le statut de la course', slug: 'poll_hail' },
      { title: 'Importance du customer_id dans le parcours client', slug: 'customer_id' },
      { title: 'Utilité du session_id dans le parcours client', slug: 'session_id' },
      { title: 'Cadre de la LOM', slug: 'legal_lom' },
      { title: 'Glossaire', slug: 'glossary' },
    ],
  },
  {
      title: 'Guides de référence',
      slug: 'reference_guides',
      submenus: [
        { title: 'Glossaire', slug: 'glossary' },
      ],
  },
  { title: 'Guides pratiques', slug: 'howto_guides' },
  {
    title: 'Documentation legacy',
    slug: 'legacy',
    separator: true,
    submenus: [
      { title: 'Introduction', slug: 'introduction' },
      { title: 'Moteur de recherche', slug: 'search' },
      { title: 'Opérateur', slug: 'operator' },
      { title: 'Documentation de référence', slug: 'reference' },
      { title: 'Exemples', slug: 'examples' },
    ],
  },
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

function CenteredImage({ src, alt }) {
  const classes = useStyles();
  return (
    <div className={classes.centeredImage}>
      <img src={src} alt={alt} />
    </div>
  );
}

CenteredImage.defaultProps = {
  alt: "",
};

CenteredImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
};

function InlineCode({ children }) {
  const classes = useStyles();
  return <code className={classes.inlineCode}>{ children }</code>;
}

InlineCode.propTypes = {
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
  inlineCode: InlineCode,

  CenteredImage,
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

export default function DocumentationPage({ slug }) {
  const path = `${slug.join('/')}.mdx`;
  const MDXDocument = dynamic(() => import(`@/public/documentation/${path}`));

  return (
    <MenuLayout>
      <Menu>
        {ALL_PAGES.map((page) => (
          <React.Fragment key={page.title}>
            {!page.hide && (
              <>
                { page.separator && <hr /> }
                <MenuItem
                  key={page.slug}
                  title={page.title}
                  href={`/documentation/${page.slug}`}
                />
              </>
            )}

            {page.submenus?.map((submenu) => (
              <MenuItem
                key={submenu.slug}
                title={submenu.title}
                href={`/documentation/${page.slug}/${submenu.slug}`}
                secondary
              />
            ))}
          </React.Fragment>
        ))}
      </Menu>
      <Content>
        <MDXProvider components={components}>
          <MDXDocument />
        </MDXProvider>
      </Content>
    </MenuLayout>
  );
}

DocumentationPage.propTypes = {
  slug: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export async function getStaticProps(context) {
  return {
    props: {
      // Use the first entry of ALL_PAGES as default for the root page.
      slug: context.params.slug || [ALL_PAGES[0].slug],
      optionalAuth: true,
    },
  };
}

export async function getStaticPaths() {
  const slugs = ALL_PAGES.map(
    (menu) => [[menu.slug]].concat(
      menu.submenus?.map((submenu) => [menu.slug, submenu.slug]),
    ),
  ).flat().filter((slug) => slug);

  // Push an empty array to generate the root page /documentation.
  slugs.push([]);

  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
}
