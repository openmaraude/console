import PropTypes from 'prop-types';

import Link from 'next/link';

import gfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

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
import InfoBox from '../../components/InfoBox';
import { getAllPages, getMenu } from '../../src/documentation';
import { TextLink } from '../../components/LinksRef';

export function DocumentationMenu({ menu }) {
  return (
    <Menu>
      {
        menu.map((item) => <MenuItem key={item.slug} title={item.title} href={`/documentation/${item.slug}`} />)
      }
    </Menu>
  );
}

const menuPropType = PropTypes.arrayOf(
  PropTypes.shape({
    slug: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }),
);

DocumentationMenu.propTypes = {
  menu: menuPropType.isRequired,
};

export default function Documentation({ menu, content }) {
  /* eslint-disable react/prop-types */
  const renderers = {
    code: ({ language, value }) => {
      if (language?.startsWith('def')) {
        const title = language.slice('def:'.length);
        return (
          <InfoBox title={title}>
            <ReactMarkdown renderers={renderers} plugins={[gfm]}>
              {value}
            </ReactMarkdown>
          </InfoBox>
        );
      }
      return (
        <SyntaxHighlighter style={dark} language={language} wrapLongLines>
          {value}
        </SyntaxHighlighter>
      );
    },

    heading: ({ level, children }) => <Typography variant={`h${level}`}>{ children }</Typography>,

    table: Table,
    tableHead: TableHead,
    tableBody: TableBody,
    tableRow: TableRow,
    tableCell: ({ children }) => <TableCell>{children}</TableCell>,

    link: (link) => <Link href={link.href} passHref><TextLink>{link.children}</TextLink></Link>,
  };
  /* eslint-enable react/prop-types */

  return (
    <MenuLayout>
      <DocumentationMenu menu={menu} />

      <Content>
        <ReactMarkdown renderers={renderers} plugins={[gfm]}>
          { content }
        </ReactMarkdown>
      </Content>
    </MenuLayout>
  );
}

Documentation.propTypes = {
  menu: menuPropType.isRequired,
  metadata: PropTypes.shape({
    title: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
  }).isRequired,
  content: PropTypes.string.isRequired,
};

export async function getStaticProps({ params }) {
  const pages = await getAllPages();
  const page = pages.find((p) => p.metadata.slug === params.slug);

  return {
    props: {
      optionalAuth: true,
      menu: getMenu(pages),
      metadata: page.metadata,
      content: page.content,
    },
  };
}

export async function getStaticPaths() {
  const pages = await getAllPages();

  return {
    paths: pages.map((page) => ({ params: { slug: page.metadata.slug } })),
    fallback: false,
  };
}
