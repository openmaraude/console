import Link from 'next/link';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import SyntaxHighlighter from 'react-syntax-highlighter';

import InfoBox from '../../components/InfoBox';
import {
  MenuLayout,
  Menu,
  MenuItem,
  Content,
} from '../../components/layouts/MenuLayout';
import { TextLink } from '../../components/LinksRef';

function Introduction() {
  return (
    <>
      <Typography variant="h4">Introduction</Typography>
      <p>
        Cette documentation technique détaille le fonctionnement de l'API
        le.taxi. Elle est destinée aux opérateurs ainsi qu'aux moteurs de
        recherche souhaitant se connecter sur l'API.
      </p>
      <InfoBox title="Définitions">
        <ul>
          <li>
            <strong>Opérateur :</strong> acteur fournissant les informations de taxis et leurs
            géolocalisation en temps réel à l'API.
          </li>
          <li>
            <strong>Moteur de recherche :</strong> acteur proposant une application de mise en
            relation entre des utilisateurs et les taxis représentés sur l'API.
          </li>
        </ul>
      </InfoBox>
      <p>
        Nous mettons à disposition un environnement de développement pour
        permettre de tester l'intégration de votre solution avec l'API. Cet
        environnement, disponible sur <TextLink href="https://dev.api.taxi">dev.api.taxi</TextLink>,
        nécessite d'être authentifié.  La demande de création de compte se
        fait par email à <TextLink href="mailto:equipe@le.taxi">equipe@le.taxi</TextLink> où
        vous devrez préciser votre statut, et si vous souhaitez créer un opérateur ou un moteur de
        recherche.
      </p>

      <Typography variant="h4">Requêtes</Typography>

      <p>
        Tous les appels à l'API doivent se faire avec les headers HTTP suivants :
      </p>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nom du header</TableCell>
            <TableCell>Valeur</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>X-Api-Key</TableCell>
            <TableCell>
              Clé d'API disponible sur la page&nbsp;
              <Link href="/account" passHref><TextLink>Mon Compte</TextLink></Link>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <p>
        Les requêtes de modifications (POST, PUT, PATCH) nécessite de fournir le header suivant :
      </p>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nom du header</TableCell>
            <TableCell>Valeur</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Content-Type</TableCell>
            <TableCell>application/json</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <p>Toutes les réponses de l'API sont contenus dans le champ data. Par exemple :</p>

      <SyntaxHighlighter language="shell">{`
$> curl 'https://dev.api.taxi/taxis/?lon=2.3500013351440434&lat=48.85999989664685' \\
      -H 'X-Api-Key: XXX' | jq .
{
  "data": [
    {
      "id": "..."
    },
    ...
  ]
}`}
      </SyntaxHighlighter>

      <p>
        La section "documentation de référence" vous permet de lister et tester simplement
        tous les endpoints de l'API.
      </p>
    </>
  );
}

export function DocumentationMenu() {
  return (
    <Menu>
      <MenuItem title="Introduction" href="/documentation" />
      <MenuItem title="Moteur de recherche" href="/documentation/search" />
      <MenuItem title="Opérateur" href="/documentation/operator" />
      <MenuItem title="Documentation de référence" href="/documentation/reference" />
      <MenuItem title="Exemples" href="/documentation/examples" />
    </Menu>
  );
}

export default function DocumentationPage() {
  return (
    <MenuLayout>
      <DocumentationMenu />

      <Content>
        <Introduction />
      </Content>
    </MenuLayout>
  );
}

DocumentationPage.getInitialProps = async () => ({
  optionalAuth: true,
});
