import Image from 'next/image';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import SyntaxHighlighter from 'react-syntax-highlighter';

import InfoBox from '../../components/InfoBox';
import { MenuLayout, Content } from '../../components/layouts/MenuLayout';
import { DocumentationMenu } from './index';

function SearchProvider() {
  return (
    <>
      <Typography variant="h4">Introduction</Typography>
      <p>
        Cette page est destinée aux moteurs de recherche qui souhaitent
        s'intégrer à l'API le.taxi. En suivant cette documentation, vous saurez
        lister les taxis d'une zone, puis les réserver.
      </p>
      <InfoBox title="Prérequis">
        <ul>
          <li>
            Prendre connaissance de la documentation d'introduction.
          </li>
          <li>
            Avoir un compte sur la console.
          </li>
        </ul>
      </InfoBox>

      <Typography variant="h4">Lister les taxis</Typography>
      <p>
        L'endpoint <i>GET /taxis</i> permet de lister les taxis autour d'une
        coordonnée géographique. Les paramètres attendus sont :
      </p>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nom du paramètre</TableCell>
            <TableCell>Valeur</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell><strong>lon*</strong></TableCell>
            <TableCell>longitude autour de laquelle rechercher un taxi</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><strong>lat*</strong></TableCell>
            <TableCell>latitude autour de laquelle rechercher un taxi</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>count</TableCell>
            <TableCell>nombre maximum de taxis à retourner</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>favorite_operator</TableCell>
            <TableCell>
              si un taxi a plusieurs opérateurs actifs, l'opérateur renseigné sera
              préféré
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <p>Exemple d'appel :</p>

      <SyntaxHighlighter language="shell">{`
$> curl 'https://dev.api.taxi/taxis/?lon=2.35&lat=48.85' \\
      -H 'X-API-KEY: XXX'
`}
      </SyntaxHighlighter>

      <p>Aucun taxi ne sera retourné si aucun taxi n'est libre autour de ce point.</p>

      <Typography variant="h4">Créer une course</Typography>
      <p>L'endpoint <i>POST /hails</i> permet de créer une course :</p>

      <SyntaxHighlighter language="shell">{`
$> curl 'https://dev.api.taxi/hails/' \\
      -X POST \\
      -H "Content-Type: application/json" \\
      -H "X-API-KEY: XXX" \\
      -d '
{
  "data": [
    {
      "customer_lat": 48.85,
      "customer_lon": 2.35,
      "customer_address": "52 boulevard Saint-Germain, Paris 75005",
      "taxi_id": "taxi_id",
      "customer_phone_number": "0673457191",
      "operateur": "neotaxi",
      "customer_id": "internal_customer_id"
    }
  ]
}'
`}
      </SyntaxHighlighter>

      <p>Ces points sont à noter :</p>

      <ul>
        <li><i>taxi_id</i> est retourné par l'endpoint <i>GET /taxis</i>.</li>
        <li>
          Les paramètres <i>customer_lon</i> et <i>customer_lat</i> doivent correspondre à ceux
          utilisés pour obtenir la liste des taxis.
        </li>
        <li>
          L'adresse <i>customer_address</i> sera montée au taxi une fois la course acceptée par
          celui-ci.
        </li>
        <li>
          Vous devez vérifier la validité du <i>customer_phone_number</i>, que ce soit par un SMS de
          confirmation ou par un appel.
        </li>
        <li>
          <i>customer_id</i> est votre identifiant pour ce client. Il doit être unique pour chaque
          client.
        </li>
        <li>
          Vous recevez un <i>session_id</i> de type UUID4 dans la ressource renvoyée en réponse,
          voir ci-dessous.
        </li>
      </ul>

      <Typography variant="h5">Session id</Typography>

      <p>
        L'API considère les créations de course d'un même client comme faisant partie de la même
        session utilisateur quand elles sont assez proches dans le temps (moins de 5 minutes
        entre deux requêtes).
      </p>

      <p>
        La première requête se fait sans <i>session_id</i> et initie la session utilisateur. C'est
        l'API qui assigne le session_id en le fournissant dans la réponse. L'application fournit
        ensuite ce <i>session_id</i> dans les requêtes suivantes de la même session utilisateur.
        l'API vérifiera que cet ID existe et correspond bien à ce client, mais il est à la
        discrétion de l'application de déterminer la durée de validité de cette session.
      </p>

      <p>
        Il suffit de faire une requête sans <i>session_id</i>pour initier une nouvelle session.
        L'API détecte automatiquement les requêtes espacées de moins de 5 minutes pour les assigner
        automatiquement à la même session, mais ce champ pourrait être rendu obligatoire dans une
        future version de l'API.
      </p>

      <Typography variant="h4">Déroulement de la course</Typography>

      <p>
        Le suivi d'une course se fait par des appels successifs à l'endpoint
        <i>GET /hails/:hail_id</i>. Le schéma ci-dessous montre les différents statuts d'une course,
        et leurs enchainements possibles.
      </p>

      <div>
        <Image src="/doc/trip-status.png" width="734" height="1040" layout="intrinsic" />
      </div>

      <p>
        Il est nécessaire de faire des requêtes régulièrement sur l'endpoint
        <i>GET /hails/:hail_id</i> afin d'informer votre client de l'évolution de la course, de lui
        permettre de passer au statut suivant lorsque c'est nécessaire, ou de l'informer d'une
        erreur. Faisons un zoom sur les actions que vous devez exécuter&nbsp;:
      </p>

      <div>
        <Image src="/doc/trip-status-search.png" width="584" height="312" layout="intrinsic" />
      </div>

      <p>
        Lorsque l'API reçoit une demande de course, celle-ci est transmise à l'opérateur du taxi.
        Dans le cas où le taxi accepte la course, vous avez une vingtaine de secondes pour demander
        à votre client de confirmer une dernière fois la course. Deux statuts sont alors
        disponibles&nbsp;:
      </p>

      <ul>
        <li>
          <i>declined_by_customer :</i> le client ne souhaite pas confirmer la course et en informe
          le taxi.
        </li>
        <li>
          <i>accepted_by_customer :</i> le client confirme la course, le taxi vient le
          chercher.
        </li>
      </ul>

      <p>
        Vous devez à tout moment permettre au client d'annuler la course en passant au
        statut <i>incident_customer</i>.
      </p>

      <p>Exemple d'appel :</p>

      <SyntaxHighlighter language="shell">{`
$> curl 'https://dev.api.taxi/hails/:hail_id/' \\
      -X PUT \\
      -H 'Content-Type: application/json' \\
      -H 'X-API-KEY: XXX' \\
      -d '
{
  "data": [
    {
      "status": "accepted_by_customer"
    }
  ]
}'
`}
      </SyntaxHighlighter>

    </>
  );
}

export default function DocumentationSearchPage() {
  return (
    <MenuLayout>
      <DocumentationMenu />

      <Content>
        <SearchProvider />
      </Content>
    </MenuLayout>
  );
}

DocumentationSearchPage.getInitialProps = async () => ({
  optionalAuth: true,
});
