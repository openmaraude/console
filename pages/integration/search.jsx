import React from 'react';
import PropTypes from "prop-types";

import Link from 'next/link';

import useSWR from 'swr';

import { Alert } from '@material-ui/lab';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import APIErrorAlert from '../../components/APIErrorAlert';
import APIListTable from '../../components/APIListTable';
import { formatDate } from '../../src/utils';
import { Layout } from './index';
import { requestList, requestOne } from '../../src/api';
import { TextLink } from '../../components/LinksRef';
import { TimeoutTextField } from '../../components/TimeoutForm';
import { UserContext } from '../../src/auth';

const useStyles = makeStyles((theme) => ({
  section: {
    marginBottom: theme.spacing(2),
  },

  detailsBox: {
    display: 'flex',
    flexWrap: 'wrap',

    '& > *': {
      margin: theme.spacing(2),
      minWidth: '25%',
      width: 'auto',
    },
  },

  tableTitle: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    textAlign: 'center',
  },

  hailRequestForm: {
    display: 'flex',
    flexDirection: 'column',
  },

  actionsCards: {
    display: 'flex',
    flexWrap: 'wrap',

    '& > *': {
      marginRight: theme.spacing(2),
      marginBottom: theme.spacing(2),
      width: '270px',
      textAlign: 'center',
    },
  },
}));

// Change hail status
function HailDetailActions({ hail }) {
  const classes = useStyles();
  const userContext = React.useContext(UserContext);
  const [response, setApiResponse] = React.useState({});
  let actions;

  function updateHailStatus(newStatus) {
    return async () => {
      try {
        const resp = await requestOne(`/hails/${hail.id}`, {
          token: userContext.user.apikey,
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Logas': process.env.INTEGRATION_ACCOUNT_EMAIL,
          },
          body: JSON.stringify({
            data: [{
              status: newStatus,
            }],
          }),
        });
        setApiResponse({ resp });
      } catch (err) {
        setApiResponse({ error: err });
      }
    };
  }

  const incidentCustomerCard = (
    <Card>
      <CardContent>
        <Button variant="contained" color="primary" onClick={updateHailStatus('incident_customer')}>Déclarer un incident</Button>

        <p>
          Mettre le statut en <strong>incident_customer</strong> pour
          signaler un problème au niveau du client.
        </p>
      </CardContent>
    </Card>
  );

  switch (hail.status) {
    case 'received':
      actions = (
        <p>
          La course a le statut <strong>received</strong>. Elle a été reçue par
          l'API le.taxi, qui va la transmettre à l'opérateur du taxi.
        </p>
      );
      break;
    case 'received_by_operator':
      actions = (
        <p>
          La course a le statut <strong>received_by_operator</strong>. Elle a
          été transmise à l'opérateur du taxi, qui va la transmettre au taxi.
        </p>
      );
      break;
    case 'received_by_taxi':
      actions = (
        <p>
          La course a le statut <strong>received_by_taxi</strong>. Le taxi
          dispose de quelques secondes pour accepter ou refuser la course.
        </p>
      );
      break;
    case 'accepted_by_taxi':
      actions = (
        <>
          <p>
            La course a actuellement le statut <strong>{hail.status}</strong>: le
            taxi a vu et accepté la course.
          </p>

          <div className={classes.actionsCards}>
            <Card>
              <CardContent>
                <Button variant="contained" color="primary" onClick={updateHailStatus('accepted_by_customer')}>
                  Accepter la course
                </Button>

                <p>
                  Mettre le statut en <strong>accepted_by_customer</strong> pour
                  signaler que le client souhaite toujours effectuer la course.
                  Sans confirmation de la part du client, la course passera
                  automatiquement en <strong>timeout_customer</strong> après quelques secondes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Button variant="contained" color="primary" onClick={updateHailStatus('declined_by_customer')}>Refuser la course</Button>

                <p>
                  Mettre le statut en <strong>declined_by_customer</strong> pour signaler
                  que le client ne souhaite plus effectuer la course.
                </p>
              </CardContent>
            </Card>

            {incidentCustomerCard}
          </div>
        </>
      );
      break;
    case 'accepted_by_customer':
      actions = (
        <>
          <p>Le client a accepté la course. Le taxi est en route vers le client.</p>

          <div className={classes.actionsCards}>
            {incidentCustomerCard}
          </div>
        </>
      );
      break;
    case 'customer_on_board':
      actions = (
        <p>
          La course a le statut <strong>{hail.status}</strong>. Le client est à
          bord. Il peut déclarer à tout moment un incident.

          <div className={classes.actionsCards}>
            {incidentCustomerCard}
          </div>
        </p>
      );
      break;
    case 'timeout_customer':
      actions = (
        <p>
          La course a le statut <strong>{hail.status}</strong> : le client n'a
          pas répondu à temps. Il n'est pas possible de changer son statut.
        </p>
      );
      break;
    case 'timeout_taxi':
      actions = (
        <p>
          La course a le statut <strong>{hail.status}</strong> : le taxi n'a
          pas répondu à temps. Il n'est pas possible de changer son statut.
        </p>
      );
      break;
    case 'declined_by_customer':
      actions = (
        <p>
          La course a le statut <strong>{hail.status}</strong> : le client a
          effectué une demande de course, mais a explicitement refusé de
          poursuivre. Il n'est pas possible de changer son statut.
        </p>
      );
      break;
    case 'incident_customer':
      actions = (
        <p>
          La course a le statut <strong>{hail.status}</strong> : le client a
          déclaré un incident. Il n'est pas possible de changer son statut.
        </p>
      );
      break;
    case 'incident_taxi':
      actions = (
        <p>
          La course a le statut <strong>{hail.status}</strong> : le taxi a
          déclaré un incident. Il n'est pas possible de changer son statut.
        </p>
      );
      break;
    case 'finished':
      actions = (
        <p>
          La course a le statut <strong>{hail.status}</strong> : la course
          s'est correctement effectuée. Il n'est pas possible de changer son
          statut.
        </p>
      );
      break;
    default:
      actions = (
        <p>
          La course a le statut <strong>{hail.status}</strong>.
        </p>
      );
      break;
  }

  return (
    <Box marginTop={2}>
      <Typography variant="h5">Changer le statut de la course</Typography>
      {actions}
      {response.error && <APIErrorAlert error={response.error} />}
    </Box>
  );
}

HailDetailActions.propTypes = {
  hail: PropTypes.shape({
    id: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
};

function HailDetail({ hailId, onBackClicked }) {
  const classes = useStyles();
  const userContext = React.useContext(UserContext);

  const { data, error } = useSWR(
    [`/hails/${hailId}`, userContext.user.apikey],
    (url, token) => requestOne(url, {
      token,
      headers: {
        'X-Logas': process.env.INTEGRATION_ACCOUNT_EMAIL,
      },
    }),
    {
      refreshInterval: 1000,
    },
  );

  const HailDetailLayout = ({ children }) => (
    <>
      <Box marginBottom={2}><Typography variant="h5">Détails du hail</Typography></Box>

      {error && <APIErrorAlert error={error} />}

      {children}
    </>
  );

  HailDetailLayout.propTypes = {
    children: PropTypes.node.isRequired,
  };

  if (!data) {
    return (
      <HailDetailLayout>
        <LinearProgress />
      </HailDetailLayout>
    );
  }

  return (
    <HailDetailLayout>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell variant="head" className={classes.tableTitle} colSpan={2}>Informations du hail {data.id}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell variant="head">Date</TableCell>
            <TableCell>{formatDate(new Date(data.creation_datetime))}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell variant="head">Statut</TableCell>
            <TableCell>{data.status}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell variant="head">Opérateur</TableCell>
            <TableCell>{data.operateur}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell variant="head">Taxi</TableCell>
            <TableCell>{data.taxi.id}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell variant="head">Tél. taxi</TableCell>
            <TableCell>{data.taxi_phone_number}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell variant="head">Adresse du client</TableCell>
            <TableCell>{data.customer_address}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell variant="head">Longitude/Latitude du client</TableCell>
            <TableCell>{data.customer_lon}/{data.customer_lat}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell variant="head">Identifiant client</TableCell>
            <TableCell>{data.customer_id}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell variant="head">Tél. client</TableCell>
            <TableCell>{data.customer_phone_number}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <HailDetailActions hail={data} />

      <Box marginTop={2}>
        <Button color="primary" onClick={onBackClicked}>
          &lt;&lt;&lt; Retour vers le formulaire de demande de course
        </Button>
      </Box>
    </HailDetailLayout>
  );
}

HailDetail.propTypes = {
  hailId: PropTypes.string.isRequired,
  onBackClicked: PropTypes.func.isRequired,
};

function HailRequestForm({ taxi, onRequest }) {
  const classes = useStyles();
  const userContext = React.useContext(UserContext);
  const [hailRequest, setHailRequest] = React.useState({
    lon: taxi.position?.lon,
    lat: taxi.position?.lat,
    customer_address: '20 Avenue de Ségur, 75007 Paris',
    customer_phone_number: '0607080910',
    customer_id: (Math.random() * 100000000).toFixed(0).toString(),
  });
  const [error, setError] = React.useState();

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const resp = await requestOne('/hails', {
        token: userContext.user.apikey,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Logas': process.env.INTEGRATION_ACCOUNT_EMAIL,
        },
        body: JSON.stringify({
          data: [{
            customer_address: hailRequest.customer_address,
            customer_lon: hailRequest.lon,
            customer_lat: hailRequest.lat,
            customer_id: hailRequest.customer_id,
            customer_phone_number: hailRequest.customer_phone_number,
            taxi_id: taxi.id,
            operateur: taxi.operator,
          }],
        }),
      });
      onRequest(resp);
    } catch (err) {
      setError(err);
    }
  }

  function updateField(e) {
    setHailRequest({
      ...hailRequest,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <>
      <Typography variant="h5">Envoyer une demande de course au taxi {taxi.id} ({taxi.operator})</Typography>

      <form className={classes.hailRequestForm} onSubmit={onSubmit}>
        <TextField
          label="Longitude du client"
          name="lon"
          type="number"
          inputProps={{ step: 0.000001 }}
          margin="normal"
          value={hailRequest.lon}
          onChange={updateField}
        />

        <TextField
          label="Latitude du client"
          name="lat"
          type="number"
          inputProps={{ step: 0.000001 }}
          margin="normal"
          value={hailRequest.lat}
          onChange={updateField}
        />

        <TextField
          label="Adresse du client"
          name="customer_address"
          margin="normal"
          value={hailRequest.customer_address}
          onChange={updateField}
        />

        <TextField
          label="Numéro de téléphone du client"
          name="customer_phone_number"
          margin="normal"
          value={hailRequest.customer_phone_number}
          onChange={updateField}
        />

        <TextField
          label="Identifiant du client"
          name="customer_id"
          margin="normal"
          value={hailRequest.customer_id}
          onChange={updateField}
        />

        {error && <APIErrorAlert error={error} />}

        <small>
          Attention: la demande de course ne peut fonctionner que si le taxi a
          le statut <strong>free</strong> et que sa géolocalisation a été mise
          à jour il y a moins de deux minutes.
        </small>

        <Button type="submit" variant="contained" color="primary">
          Envoyer la demande de course à {taxi.operator}
        </Button>
      </form>
    </>
  );
}

HailRequestForm.propTypes = {
  taxi: PropTypes.shape({
    id: PropTypes.string,
    operator: PropTypes.string,
    position: PropTypes.shape({
      lon: PropTypes.number,
      lat: PropTypes.number,
    }),
  }).isRequired,
  onRequest: PropTypes.func.isRequired,
};

/*
 * Display form to send a hail, or details of the sent hail.
 */
function TaxiHail({ taxi }) {
  const classes = useStyles();
  const [currentHail, setCurrentHail] = React.useState();

  return (
    <section className={classes.section}>
      {currentHail
        ? <HailDetail hailId={currentHail.id} onBackClicked={() => setCurrentHail(null)} />
        : <HailRequestForm taxi={taxi} onRequest={setCurrentHail} />}
    </section>
  );
}

TaxiHail.propTypes = {
  taxi: PropTypes.shape({}).isRequired,
};

function Taxi({ taxi }) {
  const classes = useStyles();
  const userContext = React.useContext(UserContext);

  // If the user currently logged in is  the owner of the taxi, we should not
  // specify X-Logas header because integration account doesn't have the
  // permissions to view the item.
  const headers = (
    userContext.user.email === taxi.operator
      ? {}
      : { 'X-Logas': process.env.INTEGRATION_ACCOUNT_EMAIL }
  );

  const { data, error } = useSWR(
    [`/taxis/${taxi.id}`, userContext.user.apikey],
    (url, token) => requestOne(url, {
      token,
      headers,
    }),
    {
      refreshInterval: 1000,
    },
  );

  const TaxiSection = ({ children }) => (
    <section className={classes.section}>
      <Typography variant="h5">Détails du taxi {taxi.id}</Typography>

      {error && (error.status === 404
        ? (
          <Box marginTop={2} marginBottom={2}>
            <Alert severity="info">
              Ce taxi appartient à l'opérateur <strong>{taxi.operator}</strong>. Vous
              ne pouvez accéder qu'aux taxis vous appartenant, ou aux taxis de l'opérateur de
              test <strong>{process.env.INTEGRATION_ACCOUNT_EMAIL}</strong>.
            </Alert>
          </Box>
        ) : <APIErrorAlert error={error} />
      )}

      { children }
    </section>
  );

  TaxiSection.propTypes = {
    children: PropTypes.node.isRequired,
  };

  if (!data) {
    return (
      <TaxiSection>
        {/* Only display progressbar if there is no error */}
        {!error && <LinearProgress />}
      </TaxiSection>
    );
  }

  const lastLocationUpdate = data.last_update ? new Date(data.last_update * 1000) : null;

  return (
    <>
      <TaxiSection>
        <Box className={classes.detailsBox}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell variant="head" className={classes.tableTitle} colSpan={2}>Informations du taxi</TableCell>
              </TableRow>

              <TableRow>
                <TableCell variant="head">Opérateur</TableCell>
                <TableCell>{data.operator}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell variant="head">Statut</TableCell>
                <TableCell>{data.status}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          {data.position && (
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell variant="head" className={classes.tableTitle} colSpan={2}>Dernière géolocalisation</TableCell>
                </TableRow>
                <TableRow>

                  <TableCell variant="head">Date</TableCell>
                  <TableCell>{formatDate(lastLocationUpdate)}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell variant="head">Longitude</TableCell>
                  <TableCell>{data.position?.lon}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell variant="head">Latitude</TableCell>
                  <TableCell>{data.position?.lat}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </Box>
      </TaxiSection>

      <TaxiHail key={data.id} taxi={data} />
    </>
  );
}

Taxi.propTypes = {
  taxi: PropTypes.shape({
    id: PropTypes.string,
    operator: PropTypes.string,
    status: PropTypes.string,
    last_update: PropTypes.number,
  }).isRequired,
};

export default function IntegrationSearchPage() {
  const classes = useStyles();
  const userContext = React.useContext(UserContext);
  const listTaxisAvailable = (page, filters) => useSWR(
    ['/taxis', userContext.user.apikey, page, JSON.stringify(filters)],
    (url, token) => {
      if (!filters?.lon || !filters?.lat) {
        return null;
      }
      return requestList(url, page, {
        token,
        args: filters,
        headers: {
          'X-Logas': process.env.INTEGRATION_ACCOUNT_EMAIL,
        },
      });
    },
    { refreshInterval: 1000 },
  );
  const [selectedTaxi, setSelectedTaxi] = React.useState();

  const filters = (
    <>
      <TimeoutTextField
        label="Longitude"
        variant="outlined"
        margin="dense"
        name="lon"
        InputLabelProps={{ shrink: true }}
        type="number"
        inputProps={{ step: 0.000001 }}
      />
      <TimeoutTextField
        label="Latitude"
        variant="outlined"
        margin="dense"
        name="lat"
        InputLabelProps={{ shrink: true }}
        type="number"
        inputProps={{ step: 0.000001 }}
      />
    </>
  );

  const columns = [
    {
      field: 'id',
      headerName: 'Id taxi',
      flex: 1,
      sortable: false,
    },
    {
      field: 'operator',
      headerName: 'Opérateur',
      flex: 1,
      sortable: false,
    },
    {
      field: 'lon',
      headerName: 'Longitude',
      flex: 1,
      sortable: false,
      valueFormatter: (cell) => cell.row.position.lon.toFixed(5),
    },
    {
      field: 'lat',
      headerName: 'Latitude',
      flex: 1,
      sortable: false,
      valueFormatter: (cell) => cell.row.position.lat.toFixed(5),
    },
    {
      field: 'crowfly_distance',
      headerName: 'Distance',
      flex: 1,
      sortable: false,
      valueFormatter: (cell) => `${cell.row.crowfly_distance.toFixed(0)} mètres`,
    },
    {
      field: 'licence_plate',
      headerName: 'Plaque d\'immatriculation',
      flex: 1,
      sortable: false,
      valueFormatter: (cell) => cell.row.vehicle.licence_plate,
    },
    {
      field: 'status',
      headerName: 'Statut',
      flex: 1,
      sortable: false,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: (cell) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setSelectedTaxi(cell.row)}
        >
          {">>"}
        </Button>
      ),
    },
  ];

  return (
    <Layout>
      <Typography variant="h4">Simulation d'un applicatif client</Typography>

      <p>
        Vous souhaitez créer une application chauffeur afin d'envoyer à
        l'API la géolocalisation et la disponibilité de vos taxis.
        Comment faire pour simuler la demande de course de la part d'un
        client ? L'annulation de cette demande ?
      </p>

      <p>
        Cette page vous permet de simuler simplement un applicatif client.
      </p>

      <p>
        La <Link href="/documentation/introduction" passHref><TextLink>documentation</TextLink></Link> est
        disponible pour vous guider sur le développement de votre application.
      </p>

      <section className={classes.section}>
        <Typography variant="h5">Lister les taxis disponibles</Typography>

        <p>
          Renseignez des coordonnées pour lister les taxis autour de ce point.
          Seuls les taxis libres ayant mis à jour leur géolocalisation il y a
          moins de deux minutes sont affichés.
        </p>

        <APIListTable
          apiFunc={listTaxisAvailable}
          columns={columns}
          filters={filters}
          // Hide table unless lon and lat filters are filled
          hideUntilFiltersFilled
        />
      </section>

      {selectedTaxi && <Taxi taxi={selectedTaxi} />}
    </Layout>
  );
}
