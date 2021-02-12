import Image from 'next/image';

import Typography from '@material-ui/core/Typography';

import SyntaxHighlighter from 'react-syntax-highlighter';

import InfoBox from '../../components/InfoBox';
import { MenuLayout, Content } from '../../components/layouts/MenuLayout';
import { TextLink } from '../../components/LinksRef';
import { DocumentationMenu } from './index';

function Operator() {
  return (
    <>
      <Typography variant="h4">Introduction</Typography>

      <p>
        Cette page est destinée aux opérateurs qui souhaitent s'intégrer à l'API le.taxi. En suivant
        cette documentation, vous saurez créer un taxi, mettre à jour sa géolocalisation, mettre à
        jour son statut et recevoir une course.
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

      <Typography variant="h4">Création d'un taxi</Typography>

      <p>
        Pour l'API, un taxi est constitué de trois objets : un conducteur (driver), un véhicule
        (vehicle) et une autorisation de stationnement (ads). Ces objets doivent être créés afin de
        créer un nouveau taxi.
      </p>

      <p>
        Il est à votre charge de demander et vérifier les pièces justificatives permettant au taxi
        d'exercer :
      </p>

      <ul>
        <li>Permis de conduire et carte d'identité ou passeport.</li>
        <li>Carte professionnelle du chauffeur.</li>
        <li>Carte grise du véhicule.</li>
        <li>Autorisation de stationnement.</li>
      </ul>

      <Typography variant="h5">Création du conducteur</Typography>

      <p>
        L'endpoint <i>POST /drivers</i> est utilisé pour créer un nouveau conducteur.
      </p>

      <p>Exemple d'appel :</p>

      <SyntaxHighlighter language="shell">{`
$> curl 'https://dev.api.taxi/drivers/' \\
      -X POST \\
      -H 'Content-Type: application/json' \\
      -H 'X-API-KEY: XXX' \\
      -d '
{
  "data": [{
    "birth_date": "2020-03-05",
    "departement": {
      "nom": "string",
      "numero": "string"
    },
    "first_name": "string",
    "last_name": "string",
    "professional_licence": "string"
  }]
}'
`}
      </SyntaxHighlighter>

      <ul>
        <li>
          <i>birth_date :</i> date de naissance du conducteur, vous devez pouvoir la vérifier sur le
          justificatif fournit par le chauffeur de taxi.
        </li>
        <li><i>first_name :</i> prénom du chauffeur.</li>
        <li>last_name: nom de famille du chauffeur.</li>
        <li>
          <i>departement :</i> département de délivrance de la carte professionnelle du chauffeur.
          Vous pouvez renseigner le nom ou le numéro du département.
        </li>
        <li>
          <i>professional_licence :</i> numéro de la carte professionnelle du chauffeur.
        </li>
      </ul>

      <Typography variant="h5">Création du véhicule</Typography>

      <p>
        L'endpoint <i>POST /vehicles</i> permet de créer un nouveau véhicule.
      </p>

      <p>Exemple d'appel :</p>

      <SyntaxHighlighter language="shell">{`
$> curl 'https://dev.api.taxi/vehicles/' \\
      -X POST \\
      -H 'Content-Type: application/json' \\
      -H 'X-API-KEY: XXX' \\
      -d '
{
  "data": [
    {
      "color": "string",
      "pet_accepted": true,
      "special_need_vehicle": true,
      "cpam_conventionne": true,
      "licence_plate": "string",
      "model_year": 0,
      "type_": "sedan",
      "nb_seats": 0,
      "constructor": "string",
      "model": "string"
    }
  ]
}'
`}
      </SyntaxHighlighter>

      <p>
        Le seul paramètre requis est <i>licence_plate</i>. Les autres sont optionnels mais
        permettent au client de retrouver plus facilement le taxi.
      </p>

      <Typography variant="h5">Création de l'ADS</Typography>

      <p>
        L'endpoint <i>POST /ads</i> permet de créer une nouvelle autorisation de stationnement.
      </p>

      <SyntaxHighlighter language="shell">{`
$> curl 'https://dev.api.taxi/ads/' \\
      -X POST \\
      -H 'Content-Type: application/json' \\
      -H 'X-API-KEY: XXX' \\
      -d '
{
  "data": [
    {
      "category": "string",
      "vehicle_id": 0,
      "insee": "string",
      "numero": "string",
      "owner_name": "string",
      "owner_type": "company",
      "doublage": true
    }
  ]
}'
`}
      </SyntaxHighlighter>

      <p>
        Paramètres :
      </p>

      <ul>
        <li>
          <i>category :</i> catégorie de l'ADS (perpétuité, cessible, incessible, annuelle).
        </li>
        <li>
          <i>insee :</i> code insee de la commune de l'ADS. Vous pouvez trouver ce code sur le site
          de l'INSEE.
        </li>
        <li>
          <i>numero :</i> numéro de l'ADS.
        </li>
        <li>
          <i>owner_name :</i> nom du propriétaire de l'ADS. S'il s'agit d'une entreprise, le nom de
          l'entreprise.
        </li>
        <li>
          <i>owner_type :</i> individual s'il s'agit d'une autorisation donnée à une personne,
          company s'il s'agit d'une autorisation donnée à une entreprise.
        </li>
        <li>
          <i>doublage :</i> booléen à true si l'ADS est doublée.
        </li>
        <li>
          <i>vehicle_id :</i> l'identifiant donnée lors du <i>POST /vehicles/</i>.
        </li>
      </ul>

      <Typography variant="h5">Création du taxi</Typography>

      <p>
        Il est possible de créer un taxi en faisant un <i>POST /taxis</i> en fournissant les
        informations sur le chauffeur, le véhicule et l'autorisation de stationnement.
      </p>

      <p>Exemple d'appel :</p>

      <SyntaxHighlighter language="shell">{`
$> curl 'https://dev.api.taxi/taxis/' \\
      -X POST \\
      -H 'Content-Type: application/json' \\
      -H 'X-API-KEY: XXX' \
      -d '
{
  "data": [
    {
      "ads": {
        "insee": "string",
        "numero": "string"
      },
      "driver": {
        "departement": "string",
        "professional_licence": "string"
      },
      "vehicle": {
        "licence_plate": "string"
      }
    }
  ]
}'
`}
      </SyntaxHighlighter>

      <p>
        L'identifiant retourné doit être conservé afin de mettre à jour la position et le statut du
        taxi.
      </p>

      <Typography variant="h4">Géolocalisation</Typography>

      <p>
        Lorsqu'un taxi est en maraude, vous devez envoyer sa géolocalisation toutes les 5 secondes
        sur le serveur <i>geoloc.dev.api.taxi</i> en UDP sur le port 80.
      </p>

      <p>
        La requête de mise à jour de la géolocalisation doit contenir un hash d'identification. Ce
        hash est un SHA1 de la concaténation des champs suivants, dans l'ordre, et sans séparateur :
        <i>timestamp</i>, <i>operator</i>, <i>taxi</i>, <i>lat</i>, <i>lon</i>, <i>device</i>,
        <i>status</i>, <i>version</i>, <i>api_key</i>.
      </p>

      <p>
        Ci-dessous un exemple en python d'une fonction envoyant au serveur de geolocalisation la
        position d'un taxi.
      </p>

      <SyntaxHighlighter language="python">{`
from hashlib import sha1
from time import time
import socket
import json


GEOTAXI_HOST = 'geoloc.dev.api.taxi'
GEOTAXI_PORT = 80


def send_position(lon, lat, taxi_id, operator, apikey):
    payload = {
        "timestamp": int(time()),
        "operator": operator,
        "taxi": taxi_id,
        "lat": lat,
        "lon": lon,
        "device": "phone",
        "status": "free",
        "version":"2",
    }
    h = ''.join(
        str(payload[k]) for k in [
          'timestamp',
          'operator',
          'taxi',
          'lat',
          'lon',
          'device',
          'status',
          'version'
        ]
    )
    h += apikey
    payload['hash'] = sha1(
      h.encode('utf-8')
    ).hexdigest()

    sock = socket.socket(
      socket.AF_INET,
      socket.SOCK_DGRAM
    )
    sock.sendto(
      json.dumps(payload).encode(),
      (GEOTAXI_HOST, GEOTAXI_PORT)
    )
`}
      </SyntaxHighlighter>

      <Typography variant="h4">Statut du taxi</Typography>

      <p>
        Le taxi doit avoir le statut <i>free</i> pour être vu par les clients. La mise à jour de ce
        statut se fait avec l'endpoint <i>PUT /taxis/:taxi_id</i>.
      </p>

      <p>Exemple d'appel :</p>

      <SyntaxHighlighter language="shell">{`
$> curl 'https://dev.api.taxi/taxis/:taxi_id/' \\
      -X PUT \\
      -H 'Content-Type: application/json' \\
      -H 'X-API-KEY: XXX' \\
      -d '
{
  "data": [
    {
      "status": "free"
    }
  ]
}'
`}
      </SyntaxHighlighter>

      <p>
        Les statuts possibles sont:
      </p>

      <ul>
        <li><i>free</i></li>
        <li><i>occupied</i></li>
        <li><i>off</i></li>
        <li>
          <i>oncoming</i>: ce statut est aussi automatiquement donné au taxi lorsque celui-ci a
          reçu une course avec le statut <i>accepted_by_customer</i>. Référez-vous à la
          documentation des moteurs de recherche pour plus d'informations.
        </li>
      </ul>

      <Typography variant="h4">Recevoir une course</Typography>

      <p>
        Vous devez mettre en place une API REST acceptant les requêtes POST de la part de nos
        serveurs. Cette API recevra les demandes de courses au format JSON, et devra les faire
        parvenir au taxi concerné.
      </p>

      <p>
        Il y a deux méthodes pour faire parvenir la demande au taxi :
      </p>

      <ul>
        <li>
          envoyer une notification push : votre serveur envoie une notification à l'application
          chauffeur.
        </li>
        <li>
          faire du polling : l'application chauffeur demande à votre serveur si il a reçu une
          course, à interval régulier, par exemple toutes les secondes.
        </li>
      </ul>

      <p>
        Quelle que soit la méthode que vous choisissez, vous aurez un maximum de 10 secondes pour
        nous indiquer que le chauffeur a bien reçu la notification. Il aura alors 30 secondes pour
        accepter ou refuser la course. Référez-vous à la section statut de la course pour plus
        d'informations.
      </p>

      <p>
        Un&nbsp;
        <TextLink href="https://github.com/openmaraude/minimal_operateur_server">serveur d'exemple</TextLink>
        &nbsp;est disponible sur Github.
      </p>

      <Typography variant="h4">Statut de la course</Typography>

      <p>
        Ce schéma présente les différents statuts que peut prendre une course.
      </p>

      <div>
        <Image src="/doc/trip-status.png" width="734" height="1040" layout="intrinsic" />
      </div>

      <p>
        Les mises à jour effectuables par un opérateur sont matérialisées par des flèches vertes.
        Faisons un zoom sur cette partie.
      </p>

      <div>
        <Image src="/doc/trip-status-operator.png" width="543" height="670" layout="intrinsic" />
      </div>

      <p>Voici textuellement le déroulé de la course :</p>

      <ul>
        <li>
          Un moteur de recherche fait parvenir une demande de course à l'API le.taxi.
        </li>
        <li>
          Nous envoyons sur le serveur de l'opérateur — le votre — la demande de course. Si nous ne
          parvenons pas à joindre votre serveur, le statut de la course devient failure. Sinon, la
          course est au statut <i>received_by_operator</i>.
        </li>
        <li>
          Vous envoyez la notification au taxi. Si au bout de 10 secondes la course n'est pas passée
          au statut <i>received_by_taxi</i>, nous la mettons au statut failure. Attention ! Ne
          mettez le statut <i>received_by_taxi</i> que lorsque vous êtes certain que le taxi a reçu
          la notification.
        </li>
      </ul>

      <p>
        Une fois que la course a le statut <i>received_by_taxi</i>, trois mises à jour sont
        possibles :
      </p>

      <ul>
        <li>
          <i>accepted_by_taxi:</i> la course est acceptée par le chauffeur. Il faut informer le
          chauffeur de l'évolution de la course. Le client doit valider sa demande.
        </li>
        <li>
          <i>declined_by_taxi:</i> le chauffeur ne peut pas prendre la course, il décline.
        </li>
        <li>
          <i>incident_taxi:</i> le chauffeur a un empêchement (accident, trafic…). Il peut annuler
          la course même après l'avoir acceptée, ou que le client l'ait acceptée.
        </li>
      </ul>

      <p>
        Dans le cas où aucune mise à jour n'est effectuée en 30 secondes, la course passe au
        statut <i>timeout_taxi</i>.
      </p>

      <p>L'endpoint <i>PUT /hails/:hail_id</i> permet de mettre à jour le statut d'une course.</p>

      <p>Exemple d'appel :</p>

      <SyntaxHighlighter language="shell">{`
$> curl 'https://dev.api.taxi/hails/:hail_id/' \\
      -X POST \\
      -H 'Content-Type: application/json' \\
      -H 'X-API-KEY: XXX' \\
      -d '
{
  "data": [
    {
      "status": "received_by_taxi"
    }
  ]
}'
`}
      </SyntaxHighlighter>

      <Typography variant="h6">Cas particulier pour le statut accepted_by_taxi</Typography>

      <p>
        Lorsque le taxi accepte la course et que le statut est changé à <i>accepted_by_taxi</i>, il
        est nécessaire de fournir un numéro de téléphone sur lequel le taxi est joignable dans le
        champ <i>taxi_phone_number</i>.
      </p>

      <SyntaxHighlighter language="shell">{`
$> curl 'https://dev.api.taxi/hails/:hail_id/' \\
      -X POST \\
      -H 'Content-Type: application/json' \\
      -H 'X-API-KEY: XXX' \\
      -d '
      {
  "data": [
    {
      "status": "accepted_by_taxi",
      "taxi_phone_number": "+33422521010"
    }
  ]
}'
`}
      </SyntaxHighlighter>

      <Typography variant="h6">Déroulé de la course</Typography>

      <p>
        Une fois la course acceptée par le taxi, le moteur change le statut de la course
        en <i>accepted_by_customer</i> et le taxi peut se diriger vers le client.
      </p>

      <p>
        Pour un déroulé normal de course, vous devez déclarer le client à bord en changeant le
        statut à <i>customer_on_board</i>, puis la course terminée avec le statut <i>finished</i>.
      </p>

      <div>
        <Image src="/doc/trip-status-operator-accepted.png" width="206" height="320" layout="intrinsic" />
      </div>

      <Typography variant="h4">Signalement de client</Typography>

      <p>
        Un problème lors de la course peut être signalé en utilisant
        l'endpoint <i>PUT /hails/hail_id</i>, en fournissant le
        paramètre <i>reporting_customer</i> à <i>true</i>
        et le champ <i>reporting_customer_reason</i> à une des valeurs suivantes :
      </p>

      <ul>
        <li><i>payment:</i> il y a eu un problème avec le paiement.</li>
        <li><i>courtesy:</i> le client n'était pas courtois.</li>
        <li><i>cleanliness:</i> le client n'était pas propre.</li>
        <li><i>late:</i> le client était en retard.</li>
        <li><i>aggressive:</i> le client était agressif.</li>
        <li><i>no_show:</i> le client ne s'est pas présenté.</li>
      </ul>
    </>
  );
}

export default function DocumentationOperatorPage() {
  return (
    <MenuLayout>
      <DocumentationMenu />

      <Content>
        <Operator />
      </Content>
    </MenuLayout>
  );
}

DocumentationOperatorPage.getInitialProps = async () => ({
  optionalAuth: true,
});
