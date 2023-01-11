import React from 'react';
import PropTypes from "prop-types";

import Link from 'next/link';

import useSWR from 'swr';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import LinearProgress from '@mui/material/LinearProgress';
import { makeStyles } from 'tss-react/mui';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import faker from 'faker/locale/fr';

import { formatDate, formatLoc } from '@/src/utils';
import { request, requestOne, requestList } from '@/src/api';
import { UserContext } from '@/src/auth';
import APIErrorAlert from '@/components/APIErrorAlert';
import APIListTable from '@/components/APIListTable';
import SearchAddressDialog from '@/components/SearchAddressDialog';
import { Layout } from './index';

const useStyles = makeStyles()((theme) => ({
  section: {
    marginBottom: theme.spacing(2),
  },

  statusFormControl: {
    minWidth: 200,
  },

  radiusFormControl: {
    minWidth: 200,
  },

  newLocationForm: {
    display: 'flex',
    alignItems: 'center',

    '& > *': {
      marginRight: theme.spacing(2),
    },
  },

  tableTitle: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    textAlign: 'center',
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

// Section to change taxi status
function TaxiSetNewStatus({ taxi }) {
  const { classes } = useStyles();
  const userContext = React.useContext(UserContext);
  const [error, setError] = React.useState();

  const onTaxiStatusChange = async (e) => {
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
  };

  const initialValue = ['free', 'occupied', 'off'].indexOf(taxi.status) >= 0 ? taxi.status : "";

  return (
    <section className={classes.section}>
      <p>Le taxi a le statut <strong>{taxi.status}</strong>.</p>

      <p>
        <em>Seuls les taxis avec le statut free peuvent apparaitre lors d'une recherche.</em>
      </p>

      <FormControl variant="standard" className={classes.statusFormControl}>
        <InputLabel id="setTaxiStatus">Changer le statut</InputLabel>
        <Select
          variant="standard"
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

// Section to change taxi visibility radius
function TaxiSetNewRadius({ taxi }) {
  const { classes } = useStyles();
  const userContext = React.useContext(UserContext);
  const [error, setError] = React.useState();

  const onTaxiRadiusChange = async (e) => {
    setError(null);
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
            radius: e.target.value === "null" ? null : e.target.value,
          }],
        }),
      });
    } catch (err) {
      setError(err);
    }
  };

  const initialValue = taxi.radius === null ? "null" : taxi.radius;

  return (
    <section className={classes.section}>
      <p>
        {taxi.radius ? (
          <>Le taxi est visible dans <strong>un rayon de {taxi.radius} mètres</strong></>
        ) : (
          <>Le taxi est visible dans <strong>le rayon par défaut</strong></>
        )}
      </p>

      <p>
        <em>
          Ce rayon concerne le taxi, le client final demande toujours
          les taxis disponibles dans un rayon de 500 mètres.
        </em>
      </p>

      <FormControl variant="standard" className={classes.radiusFormControl}>
        <InputLabel id="setTaxiRadius">Changer le rayon</InputLabel>
        <Select
          variant="standard"
          labelId="setTaxiRadius"
          value={initialValue}
          onChange={onTaxiRadiusChange}
        >
          <MenuItem value="null">par défaut</MenuItem>
          <MenuItem value="150">150 mètres</MenuItem>
          <MenuItem value="200">200 mètres</MenuItem>
          <MenuItem value="250">250 mètres</MenuItem>
          <MenuItem value="300">300 mètres</MenuItem>
          <MenuItem value="350">350 mètres</MenuItem>
          <MenuItem value="400">400 mètres</MenuItem>
          <MenuItem value="450">450 mètres</MenuItem>
          <MenuItem value="500">500 mètres</MenuItem>
        </Select>
      </FormControl>

      {error && <APIErrorAlert error={error} />}
    </section>
  );
}

TaxiSetNewRadius.propTypes = {
  taxi: PropTypes.shape({
    id: PropTypes.string,
    radius: PropTypes.number,
  }).isRequired,
};

// Section to change taxi location
function TaxiSetNewLocation({ taxi }) {
  const { classes } = useStyles();
  const userContext = React.useContext(UserContext);
  const [values, setValues] = React.useState({
    lon: taxi.position.lon,
    lat: taxi.position.lat,
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState();
  const [searchDialog, setSearchDialog] = React.useState(false);

  const updateField = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const onSearch = (address) => {
    if (address && address.geometry && address.geometry.coordinates) {
      setValues({
        lon: address.geometry.coordinates[0],
        lat: address.geometry.coordinates[1],
      });
    }
    setSearchDialog(false);
  };

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
          inputProps={{ step: "any" }}
          margin="normal"
          value={values.lon || ""}
          onChange={updateField}
          required
        />

        <TextField
          label="Latitude"
          name="lat"
          type="number"
          inputProps={{ step: "any" }}
          margin="normal"
          value={values.lat || ""}
          onChange={updateField}
          required
        />

        <Button type="submit" variant="contained" size="small" disabled={loading}>
          Mettre à jour
        </Button>
        <Button variant="contained" color="secondary" size="small" onClick={() => setSearchDialog(true)}>Chercher une adresse</Button>
        <SearchAddressDialog open={searchDialog} onClose={onSearch} mapMode={false} />
      </form>

      <small>
        Attention ! L'ADS de ce taxi est limitée à la ZUPC avec le code
        INSEE <strong>{taxi.ads.insee}</strong>. Si vous déplacez le taxi en
        dehors de sa zone de prise en charge, il ne sera pas visible lors d'une recherche.
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

// Update hail status
function HailDetailActions({ hail }) {
  const { classes } = useStyles();
  const userContext = React.useContext(UserContext);
  const [response, setApiResponse] = React.useState({});
  let actions;

  function updateHailStatus(newStatus, taxiPhoneNumber = undefined) {
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
              taxi_phone_number: taxiPhoneNumber,
            }],
          }),
        });
        setApiResponse({ resp });
      } catch (err) {
        setApiResponse({ error: err });
      }
    };
  }

  const incidentTaxiCard = (
    <Card>
      <CardContent>
        <Button variant="contained" onClick={updateHailStatus('incident_taxi')}>Déclarer un incident</Button>

        <p>
          Mettre le statut en <strong>incident_taxi</strong> pour
          signaler un problème au niveau du taxi.
        </p>
      </CardContent>
    </Card>
  );

  switch (hail.status) {
    case 'received':
      actions = (
        <p>
          La course a le statut <strong>{hail.status}</strong>. Elle a été reçue par
          l'API le.taxi, qui va la transmettre à l'opérateur du taxi.
        </p>
      );
      break;
    case 'received_by_operator':
      actions = (
        <p>
          La course a le statut <strong>{hail.status}</strong>. Elle a
          été transmise à l'opérateur du taxi, qui va la transmettre au taxi.
        </p>
      );
      break;
    case 'received_by_taxi':
      actions = (
        <>
          <p>
            La course a le statut <strong>{hail.status}</strong>. Le taxi
            dispose de 30 secondes pour accepter ou refuser la course.
            <br />
            Sans réponse de votre part, le statut sera mis à <strong>timeout_taxi</strong>,
            et le statut du taxi sera mis à <em>off</em>.
          </p>

          <div className={classes.actionsCards}>
            <Card>
              <CardContent>
                <Button variant="contained" onClick={updateHailStatus('accepted_by_taxi', '0607080910')}>
                  Accepter la course
                </Button>

                <p>
                  Mettre le statut à <strong>accepted_by_taxi</strong> pour
                  accepter la demande de course.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Button variant="contained" onClick={updateHailStatus('declined_by_taxi')}>
                  Refuser la course
                </Button>

                <p>
                  Mettre le statut à <strong>declined_by_taxi</strong> pour
                  refuser la demande de course (mettra le statut du taxi à <em>off</em>).
                </p>
              </CardContent>
            </Card>

            {incidentTaxiCard}
          </div>
        </>
      );
      break;
    case 'accepted_by_taxi':
      actions = (
        <p>
          La course a le statut <strong>{hail.status}</strong>. Le taxi a
          accepté la course. La course est en attente de confirmation par le
          client.
        </p>
      );
      break;
    case 'accepted_by_customer':
      actions = (
        <>
          <p>
            La course a actuellement le statut <strong>{hail.status}</strong> :
            le client a confirmé sa demande. Le taxi se dirige vers le client.
          </p>

          <div className={classes.actionsCards}>
            <Card>
              <CardContent>
                <Button variant="contained" onClick={updateHailStatus('customer_on_board')}>
                  Déclarer le client à bord
                </Button>

                <p>
                  Mettre le statut à <strong>customer_on_board</strong> pour
                  signaler que le client est à bord.
                </p>
              </CardContent>
            </Card>

            {incidentTaxiCard}
          </div>
        </>
      );
      break;
    case 'customer_on_board':
      actions = (
        <p>
          La course a le statut <strong>{hail.status}</strong>. Le client est à
          bord.

          <div className={classes.actionsCards}>
            <Card>
              <CardContent>
                <Button variant="contained" onClick={updateHailStatus('finished')}>
                  Terminer la course
                </Button>

                <p>
                  Mettre le statut à <strong>finished</strong> pour terminer la
                  course.
                </p>
              </CardContent>
            </Card>
            {incidentTaxiCard}
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
  const { classes } = useStyles();
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
  const sectionRef = React.createRef();

  // Scroll to section when page loads.
  React.useEffect(() => {
    sectionRef.current.scrollIntoView();
  }, [hailId]);

  const HailDetailLayout = React.useCallback(({ children }) => (
    <>
      <Box ref={sectionRef} marginBottom={2}>
        <Typography variant="h5">Détails du hail</Typography>
      </Box>

      {error && <APIErrorAlert error={error} />}

      {children}
    </>
  ), [hailId]);

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
        <Button onClick={onBackClicked}>
          &lt;&lt;&lt; Fermer les détails du hail
        </Button>
      </Box>
    </HailDetailLayout>
  );
}

HailDetail.propTypes = {
  hailId: PropTypes.string.isRequired,
  onBackClicked: PropTypes.func.isRequired,
};

function TaxiHailsList({ taxi }) {
  const { classes } = useStyles();
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
      valueFormatter: ({ value }) => formatDate(value),
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
          onClick={() => setSelectedHail(cell.row)}
        >
          {">>"}
        </Button>
      ),
    },
  ];

  return (
    <>
      <section className={classes.section}>
        <Typography variant="h5">Liste des courses du taxi</Typography>
        <APIListTable
          apiFunc={listHails}
          columns={columns}
        />
      </section>
      {selectedHail
        && <HailDetail hailId={selectedHail.id} onBackClicked={() => setSelectedHail(null)} />}
    </>
  );
}

TaxiHailsList.propTypes = {
  taxi: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
};

function Taxi({ taxi }) {
  const { classes } = useStyles();
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
  const sectionRef = React.createRef();

  // Scroll to section when page loads.
  React.useEffect(() => {
    sectionRef.current.scrollIntoView();
  }, [taxi]);

  // Avoid code duplication.
  const TaxiSection = React.useCallback(({ children }) => (
    <section ref={sectionRef} className={classes.section}>
      <Typography variant="h5">Détails du taxi {taxi.id}</Typography>

      {error && <APIErrorAlert error={error} />}
      {children}
    </section>
  ), [taxi]);

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
              <TableCell>
                <TaxiSetNewStatus key={`status-${taxi.id}`} taxi={data} />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell variant="head">Rayon</TableCell>
              <TableCell>
                <TaxiSetNewRadius key={`radius-${taxi.id}`} taxi={data} />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell variant="head">Dernière géolocalisation</TableCell>
              <TableCell>{formatDate(lastLocationUpdate)}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell variant="head">Géolocalisation</TableCell>
              <TableCell>
                {data.position?.lon ? `${formatLoc(data.position.lon)}, ${formatLoc(data.position.lat)}` : <i>aucune géolocalisation</i>}
                <TaxiSetNewLocation key={`location-${taxi.id}`} taxi={data} />
              </TableCell>
            </TableRow>

          </TableBody>
        </Table>
      </TaxiSection>

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
  const { classes } = useStyles();
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
  const [integrationTaxiRequest, setTaxiRequest] = React.useState({ insee: '75056', name: 'Paris (75)' });
  const [searchDialog, setSearchDialog] = React.useState(false);

  const onSearch = (address) => {
    if (address && address.properties && address.properties.citycode) {
      const codeLength = address.properties.citycode.substr(0, 2) === '97' ? 3 : 2;
      const depCode = address.properties.citycode.substr(0, codeLength);
      setTaxiRequest({
        insee: address.properties.citycode,
        name: `${address.properties.city} (${depCode})`,
      });
    }
    setSearchDialog(false);
  };

  // Create new taxi: POST /ads, POST /drivers, POST /vehicles, POST /taxis.
  // Let SWR refresh the table after refreshInterval seconds.
  const createIntegrationTaxi = async () => {
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
        insee: integrationTaxiRequest.insee,
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
  };

  const columns = [
    {
      field: 'id',
      headerName: 'Id taxi',
      flex: 1,
      sortable: false,
    },
    {
      field: 'ads',
      headerName: 'Code INSEE de l\'ADS',
      flex: 2,
      sortable: false,
      valueFormatter: ({ value }) => value.insee,
    },
    {
      field: 'driver',
      headerName: 'Chauffeur',
      flex: 2,
      sortable: false,
      valueFormatter: ({ value }) => `${value.first_name || ""} ${value.last_name || ""}`,
    },
    {
      field: 'status',
      headerName: 'Statut',
      flex: 1,
      sortable: false,
    },
    {
      field: 'radius',
      headerName: 'Rayon',
      flex: 1,
      sortable: false,
      valueFormatter: ({ value }) => value || "",
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: (cell) => (
        <Button
          variant="contained"
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
        Cette page vous permet de simuler simplement une application opérateur
        avec une flotte de taxis virtuels.
      </p>

      <blockquote>
        Attention ! notre opérateur de test neotaxi n'accepte plus automatiquement les courses.
        Dans la liste des courses du taxi à qui l'application client a envoyé sa demande,
        quand votre demande de course apparaît, il faut choisir manuellement "accepter" ou "refuser"
        quand la course est dans l'état <strong>received_by_taxi</strong>.
        Sinon la demande finira en timeout et le taxi sera basculé sur <em>off</em>.
      </blockquote>

      <p>
        La <Link href="/documentation/introduction">documentation</Link> est
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
          <Button variant="contained" size="small" onClick={createIntegrationTaxi}>
            créer nouveau taxi
          </Button>
          &nbsp;dans la ville de&nbsp;
          {integrationTaxiRequest.name} ou&nbsp;
          <Button variant="contained" color="secondary" size="small" onClick={() => setSearchDialog(true)}>Changer la ville</Button>
        </p>

        {error && <APIErrorAlert error={error} />}

        <APIListTable
          apiFunc={listIntegrationTaxis}
          columns={columns}
        />
      </section>

      {selectedTaxi && <Taxi taxi={selectedTaxi} />}
      <SearchAddressDialog open={searchDialog} onClose={onSearch} mapMode={false} />
    </Layout>
  );
}
