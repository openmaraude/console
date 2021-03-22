import React from 'react';
import PropTypes from "prop-types";

import Link from 'next/link';

import useSWR from 'swr';

import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';

import FormControl from '@material-ui/core/FormControl';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import faker from 'faker/locale/fr';

import APIErrorAlert from '../../components/APIErrorAlert';
import APIListTable from '../../components/APIListTable';
import { formatDate } from '../../src/utils';
import { Layout } from './index';
import { request, requestOne, requestList } from '../../src/api';
import { TextLink } from '../../components/LinksRef';
import { UserContext } from '../../src/auth';

const useStyles = makeStyles((theme) => ({
  section: {
    marginBottom: theme.spacing(2),
  },
  statusFormControl: {
    minWidth: 200,
  },
  newLocationForm: {
    display: 'flex',
    alignItems: 'center',

    '& > *': {
      marginRight: theme.spacing(2),
    },
  },
}));

// Section to change taxi status
function TaxiSetNewStatus({ taxi }) {
  const classes = useStyles();
  const userContext = React.useContext(UserContext);
  const [error, setError] = React.useState();

  async function onTaxiStatusChange(e) {
    try {
      await requestOne(`/taxis/${taxi.id}`, {
        token: userContext.user.apikey,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Logas': process.env.INTEGRATION_ACCOUNT_EMAIL,
        },
        body: JSON.stringify({
          data: [{
            status: e.target.value,
          }],
        }),
      });
    } catch (err) {
      setError(err);
    }
  }

  const initialValue = ['free', 'occupied', 'off'].indexOf(taxi.status) >= 0 ? taxi.status : "";

  return (
    <section className={classes.section}>
      <Typography variant="subtitle2">Changer le statut du taxi</Typography>

      <p>
        Le statut a le statut <strong>{taxi.status}</strong>. Seuls les taxis
        avec le statut <i>free</i> peuvent apparaitre lors d'une
        recherche.
      </p>

      <FormControl className={classes.statusFormControl}>
        <InputLabel id="setTaxiStatus">Changer le statut</InputLabel>
        <Select
          labelId="setTaxiStatus"
          value={initialValue}
          onChange={onTaxiStatusChange}
        >
          <MenuItem value="" disabled />
          <MenuItem value="free">Free</MenuItem>
          <MenuItem value="occupied">Occupied</MenuItem>
          <MenuItem value="off">Off</MenuItem>
        </Select>
      </FormControl>

      {error && <APIErrorAlert error={error} />}
    </section>
  );
}

TaxiSetNewStatus.propTypes = {
  taxi: PropTypes.shape({
    id: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
};

function TaxiSetNewLocation({ taxi }) {
  const classes = useStyles();
  const userContext = React.useContext(UserContext);
  const [values, setValues] = React.useState({
    lon: taxi.position.lon,
    lat: taxi.position.lat,
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState();

  function updateField(e) {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  }

  async function onSubmit(e) {
    e.preventDefault();

    try {
      setError(null);
      setLoading(true);
      await request(`/geotaxi`, {
        token: userContext.user.apikey,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Logas': process.env.INTEGRATION_ACCOUNT_EMAIL,
        },
        body: JSON.stringify({
          data: [{
            positions: [
              { taxi_id: taxi.id, lon: values.lon, lat: values.lat },
            ],
          }],
        }),
      });
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  }

  return (
    <section className={classes.section}>
      <Typography variant="subtitle2">Mise à jour de la géolocalisation</Typography>

      <p>
        Renseignez les coordonnées où vous souhaitez déplacer le taxi. Seuls
        les taxis ayant une géolocalisation mise à jour il y a moins de deux
        minutes sont visibles lors d'une recherche par un applicatif client.
      </p>

      {error && <APIErrorAlert error={error} />}

      <form className={classes.newLocationForm} onSubmit={onSubmit}>
        <TextField
          label="Longitude"
          name="lon"
          type="number"
          inputProps={{ step: 0.000001 }}
          margin="normal"
          value={values.lon || ""}
          onChange={updateField}
          required
        />

        <TextField
          label="Latitude"
          name="lat"
          type="number"
          inputProps={{ step: 0.000001 }}
          margin="normal"
          value={values.lat || ""}
          onChange={updateField}
          required
        />

        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          Mettre à jour
        </Button>
      </form>

      <small>
        Attention ! L'ADS de ce taxi est limitée à la ZUPC avec le code
        INSEE <strong>{taxi.ads.insee}</strong>. Si vous déplacez le taxi en
        dehors de cette zone, il ne sera pas visible lors d'une recherche.
      </small>
    </section>
  );
}

TaxiSetNewLocation.propTypes = {
  taxi: PropTypes.shape({
    id: PropTypes.string,
    position: PropTypes.shape({
      lon: PropTypes.number,
      lat: PropTypes.number,
    }),
    ads: PropTypes.shape({
      insee: PropTypes.string,
    }),
  }).isRequired,
};

function TaxiHailsList({ taxi }) {
  const classes = useStyles();
  const userContext = React.useContext(UserContext);
  const listHails = (page) => useSWR(
    ['/hails', userContext.user.apikey, page, taxi.id],
    (url, token) => requestList(url, page, {
      token,
      args: {
        taxi_id: taxi.id,
      },
      headers: {
        'X-Logas': process.env.INTEGRATION_ACCOUNT_EMAIL,
      },
    }),
    { refreshInterval: 1000 },
  );
  const [selectedHail, setSelectedHail] = React.useState();

  const columns = [
    {
      field: 'id',
      headerName: 'Hail Id',
      flex: 1,
      sortable: false,
    },
    {
      field: 'creation_datetime',
      headerName: 'Date',
      flex: 2,
      sortable: false,
      valueFormatter: (cell) => formatDate(new Date(cell.value)),
    },
    {
      field: 'operateur',
      headerName: 'Applicatif chauffeur',
      flex: 1,
      sortable: false,
    },
    {
      field: 'added_by',
      headerName: 'Applicatif client',
      flex: 1,
      sortable: false,
    },
    {
      field: 'status',
      headerName: 'Statut final',
      flex: 2,
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
          onClick={() => setSelectedHail(cell.row)}
        >
          {">>"}
        </Button>
      ),
    },
  ];

  return (
    <section className={classes.section}>
      <Typography variant="h5">Liste des courses du taxi</Typography>
      <APIListTable
        apiFunc={listHails}
        columns={columns}
      />
    </section>
  );
}

TaxiHailsList.propTypes = {
  taxi: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
};

function Taxi({ taxi }) {
  const classes = useStyles();
  const userContext = React.useContext(UserContext);
  const { data, error } = useSWR(
    [`/taxis/${taxi.id}`, userContext.user.apikey],
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

  // Avoid code duplication.
  const TaxiSection = ({ children }) => (
    <section className={classes.section}>
      <Typography variant="h5">Détails du taxi {taxi.id}</Typography>

      {error && <APIErrorAlert error={error} />}
      {children}
    </section>
  );

  TaxiSection.propTypes = {
    children: PropTypes.node.isRequired,
  };

  if (!data) {
    return (
      <TaxiSection>
        {!error && <LinearProgress />}
      </TaxiSection>
    );
  }

  const lastLocationUpdate = data.last_update ? new Date(data.last_update * 1000) : null;

  return (
    <>
      <TaxiSection>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell variant="head">Statut</TableCell>
              <TableCell>{data.status}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell variant="head">Dernière géolocalisation</TableCell>
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
      </TaxiSection>

      <TaxiSetNewStatus key={`status-${taxi.id}`} taxi={data} />
      <TaxiSetNewLocation key={`location-${taxi.id}`} taxi={data} />
      <TaxiHailsList key={`hails-${taxi.id}`} taxi={data} />
    </>
  );
}

Taxi.propTypes = {
  taxi: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
};

export default function IntegrationOperatorPage() {
  const classes = useStyles();
  const userContext = React.useContext(UserContext);
  const listIntegrationTaxis = (page) => useSWR(
    ['/taxis/all', userContext.user.apikey, page],
    (url, token) => requestList(url, page, {
      token,
      headers: {
        'X-Logas': process.env.INTEGRATION_ACCOUNT_EMAIL,
      },
    }),
    { refreshInterval: 1000 },
  );
  const [error, setError] = React.useState();
  const [selectedTaxi, setSelectedTaxi] = React.useState();

  // Create new taxi: POST /ads, POST /drivers, POST /vehicles, POST /taxis.
  // Let SWR refresh the table after refreshInterval seconds.
  async function createIntegrationTaxi() {
    // Helper to send POST request.
    function doPOSTRequest(endpoint, data) {
      return requestOne(endpoint, {
        token: userContext.user.apikey,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Logas': process.env.INTEGRATION_ACCOUNT_EMAIL,
        },
        body: JSON.stringify({
          data: [{
            ...data,
          }],
        }),
      });
    }

    const birthDate = new Date(faker.date.between(1950, 2001));

    try {
      const driver = await doPOSTRequest('/drivers', {
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        birth_date: `${birthDate.getFullYear()}-${birthDate.getMonth() + 1}-${birthDate.getDate()}`,
        professional_licence: `fake-${(Math.random() * 10 ** 12).toFixed(0)}`,
        departement: {
          nom: 'Paris',
        },
      });

      const vehicle = await doPOSTRequest('/vehicles', {
        color: faker.vehicle.color(),
        licence_plate: faker.vehicle.vrm(),
      });

      const ads = await doPOSTRequest('/ads', {
        insee: '75056',
        numero: (Math.random() * 10 ** 9).toFixed(0).toString(),
      });

      await doPOSTRequest('/taxis', {
        ads: {
          insee: ads.insee,
          numero: ads.numero,
        },
        driver: {
          departement: driver.departement.numero,
          professional_licence: driver.professional_licence,
        },
        vehicle: {
          licence_plate: vehicle.licence_plate,
        },
      });
      setError(null);
    } catch (err) {
      setError(err);
    }
  }

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
      field: 'vehicle',
      headerName: 'Immatriculation',
      flex: 2,
      sortable: false,
      valueFormatter: (cell) => cell.value.licence_plate,
    },
    {
      field: 'ads',
      headerName: 'Code INSEE de l\'ADS',
      flex: 2,
      sortable: false,
      valueFormatter: (cell) => cell.value.insee,
    },
    {
      field: 'driver',
      headerName: 'Chauffeur',
      flex: 2,
      sortable: false,
      valueFormatter: (cell) => `${cell.value.first_name || ""} ${cell.value.last_name || ""}`,
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
      <Typography variant="h4">Simulation d'un applicatif chauffeur</Typography>

      <p>
        Vous souhaitez créer une application client afin de mettre en relation
        vos utilisateurs avec des taxis. Comment faire pour simuler un taxi
        prêt à recevoir une course ? Un taxi qui accepte ou refuse la demande ?
      </p>

      <p>
        Cette page vous permet de simuler simplement une application opérateur.
      </p>

      <p>
        La <Link href="/documentation/introduction" passHref><TextLink>documentation</TextLink></Link> est
        disponible pour vous guider sur le développement de votre application.
      </p>

      <section className={classes.section}>
        <Typography variant="h5">Lister les taxis de test disponibles</Typography>

        <p>
          Sélectionnez un des taxis de la liste ci-dessous. Ces taxis
          appartiennent à l'opérateur de
          test <strong>{process.env.INTEGRATION_ACCOUNT_EMAIL}</strong>. Vous
          pourrez ensuite modifier le statut du taxi sélectionné, changer sa
          géolocalisation et le statut des courses reçues.
        </p>

        <p>
          Vous pouvez aussi&nbsp;
          <Button variant="contained" color="primary" size="small" onClick={createIntegrationTaxi}>
            créer nouveau taxi
          </Button>.
        </p>

        {error && <APIErrorAlert error={error} />}

        <APIListTable
          apiFunc={listIntegrationTaxis}
          columns={columns}
        />
      </section>

      {selectedTaxi && <Taxi taxi={selectedTaxi} />}
    </Layout>
  );
}
