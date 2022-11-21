import React from 'react';
import PropTypes from 'prop-types';

import dynamic from 'next/dynamic';
import Link from 'next/link';

import { makeStyles } from '@mui/styles';

import SyntaxHighlighter from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

import { MDXProvider } from '@mdx-js/react';
import Slugger from 'github-slugger';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import {
  MenuLayout,
  Content,
  Menu,
  MenuItem,
} from '@/components/layouts/MenuLayout';

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
      { title: 'Créer une application client', slug: 'create_client_app' },
      { title: 'Créer une application opérateur', slug: 'create_operator_app' },
      { title: 'Créer une application chauffeur', slug: 'create_driver_app' },
      { title: "Déroulement d'une course", slug: 'hail_details' },
    ],
  },
  {
    title: 'Guides thématiques',
    slug: 'topic_guides',
    submenus: [
      { title: '[opérateur] Importance de poll le statut de la course', slug: 'driver_poll_hail' },
      { title: '[opérateur] Modifier le rayon de visibilité du taxi', slug: 'radius' },
      { title: '[client] Importance de poll le statut de la course', slug: 'client_poll_hail' },
      { title: '[client] Importance du customer_id', slug: 'customer_id' },
      { title: '[client] Utilité du session_id dans le parcours client', slug: 'session_id' },
      { title: 'Cadre de la LOM', slug: 'legal_lom' },
      { title: 'Validation d\'une application client', slug: 'validation_client_app' },
      { title: 'Validation d\'une application chauffeur', slug: 'validation_driver_app' },
    ],
  },
  {
    title: 'Guides de référence',
    slug: 'reference_guides',
    submenus: [
      { title: 'Glossaire', slug: 'glossary' },
      { title: "Référence de l'API (Swagger)", slug: 'reference' },
    ],
  },
  {
    title: 'Guides pratiques',
    slug: 'howto_guides',
    submenus: [
      { title: "Déclarer un taxi", slug: 'create_taxi' },
      { title: "Envoyer la géolocalisation des taxis", slug: 'geotaxi' },
      { title: "Lister les taxis autour d'un point", slug: 'search_taxis' },
      { title: 'Effectuer une demande de course', slug: 'create_hail' },
      { title: "Récupérer le statut d'une course", slug: 'poll_hail' },
      { title: "Changer le statut de la course", slug: 'status_hail' },
      { title: "Changer le statut d'un taxi", slug: 'status_taxi' },
      { title: "Déclarer un incident", slug: 'declare_incident' },
      { title: "Bannir un client qui abuse du service", slug: 'ban' },
      { title: "Mettre à jour véhicule, chauffeur, ADS", slug: 'update' },
      { title: "Mon taxi n'apparaît pas sur la carte !", slug: 'help_taxi_map' },
    ],
  },
];

const slugger = new Slugger();

function Heading({ variant, children }) {
  const slug = slugger.slug(children);
  return (
    <Typography variant={variant} id={slug}>
      {children}
      <a href={`#${slug}`} title="Permalink" className="headinglink">¶</a>
    </Typography>
  );
}

Heading.propTypes = {
  variant: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

function SideNote({ children }) {
  const classes = useStyles();
  return (
    <p className={classes.sideNote}>{children}</p>
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
  return <code className={classes.inlineCode}>{children}</code>;
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
    if (className) {
      const language = className.replace(/language-/, '');
      return (
        <SyntaxHighlighter style={dark} language={language} wrapLongLines>
          {children}
        </SyntaxHighlighter>
      );
    }
    return <InlineCode>{children}</InlineCode>;
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
  a: ({ href, children }) => <Link href={href}>{children}</Link>,
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
                {page.separator && <hr />}
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
