import Typography from '@material-ui/core/Typography';

import SyntaxHighlighter from 'react-syntax-highlighter';

import { MenuLayout, Content } from '../../components/layouts/MenuLayout';
import { DocumentationMenu } from './index';

function Examples() {
  return (
    <>
      <Typography variant="h4">Exemples</Typography>

      <p>
        Cette page regroupe des exemples de requêtes sur lesquels vous pouvez vous baser pour
        développer votre application.
      </p>

      <Typography variant="h5">Exemples utiles pour les moteurs de recherche</Typography>

      <Typography variant="h6">Lister les taxis</Typography>
      <SyntaxHighlighter language="shell">{`
$> curl 'api.taxi/taxis/?lat=48.8&lon=2.3' \\
  -X GET                                   \\
  -H "X-API-KEY: XXX"
`}
      </SyntaxHighlighter>

      <Typography variant="h6">Créer une demande de course</Typography>
      <SyntaxHighlighter language="shell">{`
$> curl 'api.taxi/hails/:hail_id/'                \\
    -X POST                                       \\
    -H "Content-Type: application/json"           \\
    -H "X-API-KEY: XXX"                           \\
    -d '
{
  "data": [{
    "customer_address": "customer address",
    "customer_id": "0656435678",
    "customer_lat": 48.8,
    "customer_lon": 2.3,
    "customer_phone_number": "0656435678",
    "operateur": "operator",
    "taxi_id": "taxi_id"
  }]
}'
`}
      </SyntaxHighlighter>

      <Typography variant="h6">
        Changer le statut d'un taxi à accepted_by_customer
      </Typography>
      <SyntaxHighlighter language="shell">{`
  $> curl 'api.taxi/hails/hail_id/'          \\
      -X PUT                                 \\
      -H "Content-Type: application/json"    \\
      -H "X-API-KEY: XXX"                    \\
      -d '
  {
    "data": [{
      "status": "accepted_by_customer"
    }]
  }'
  `}
      </SyntaxHighlighter>

      <Typography variant="h5">Exemples utiles pour les opérateurs</Typography>

      <Typography variant="h6">Libérer un taxi</Typography>
      <SyntaxHighlighter language="shell">{`
$> curl 'api.taxi/taxis/:taxi_id/'      \\
    -X PUT                              \\
    -H "Content-Type: application/json" \\
    -H "X-API-KEY: XXX"                 \\
    -d '
{
  "data": [{
    "status": "free"
  }]
}'
`}
      </SyntaxHighlighter>

      <Typography variant="h6">Changer le statut d'un taxi à received_by_taxi</Typography>
      <SyntaxHighlighter language="shell">{`
$> curl 'api.taxi/hails/:hail_id/'      \\
    -X PUT                              \\
    -H "Content-Type: application/json" \\
    -H "X-API-KEY: XXX"                 \\
    -d '{
  "data": [{
    "status": "received_by_taxi"
  }]
}'
`}
      </SyntaxHighlighter>
    </>
  );
}

export default function DocumentationExamplesPage() {
  return (
    <MenuLayout>
      <DocumentationMenu />

      <Content>
        <Examples />
      </Content>
    </MenuLayout>
  );
}

DocumentationExamplesPage.getInitialProps = async () => ({
  optionalAuth: true,
});
