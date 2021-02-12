import { MenuLayout, Content } from '../../components/layouts/MenuLayout';
import { TextLink } from '../../components/LinksRef';
import { DocumentationMenu } from './index';

export default function DocumentationReferencePage() {
  return (
    <MenuLayout>
      <DocumentationMenu />

      <Content>
        {/* XXX: fix link to use local version */}
        <TextLink href="https://dev.api.taxi/doc">Cliquez ici</TextLink> pour voir la documentation swagger.
      </Content>
    </MenuLayout>
  );
}

DocumentationReferencePage.getInitialProps = async () => ({
  optionalAuth: true,
});
