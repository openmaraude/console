import PropTypes from 'prop-types';
import React from 'react';
import useSWR from 'swr';
import { makeStyles } from 'tss-react/mui';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import APIErrorAlert from '@/components/APIErrorAlert';
import APIListTable from '@/components/APIListTable';
import Map from '@/components/map/Map';
import { Circle, MapConsumer } from '@/components/map/MapComponents';
import TaxiMarker from '@/components/map/TaxiMarker';
import HailDetailActions from '@/components/integration/HailDetailActions';
import { requestList, requestOne } from '@/src/api';
import { UserContext } from '@/src/auth';
import { PARIS, reverseGeocode } from '@/src/utils';
import { Layout } from './index';

const useStyles = makeStyles()(() => ({
  hailRequestForm: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

function HailDetail({ hailId, onBackClicked }) {
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

  return (
    <>
      {error && <APIErrorAlert error={error} />}
      {!data && <LinearProgress />}
      {data && <HailDetailActions hail={data} />}

      <Box marginTop={2}>
        <Button onClick={onBackClicked}>
          &lt;&lt;&lt; Retour vers le formulaire de demande de course
        </Button>
      </Box>
    </>
  );
}

HailDetail.propTypes = {
  hailId: PropTypes.string.isRequired,
  onBackClicked: PropTypes.func.isRequired,
};

function HailRequestForm({ customer, taxi, onRequest }) {
  const { classes } = useStyles();
  const userContext = React.useContext(UserContext);
  const [hailRequest, setHailRequest] = React.useState({
    customer_phone_number: customer.phone_number,
    customer_id: customer.id,
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
            customer_address: customer.address,
            customer_lon: customer.lon,
            customer_lat: customer.lat,
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

  const updateField = (e) => {
    setHailRequest({
      ...hailRequest,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Typography variant="h5">Envoyer une demande de course au taxi {taxi.id}</Typography>

      <form className={classes.hailRequestForm} onSubmit={onSubmit}>
        <TextField
          label="Numéro de téléphone du client"
          name="customer_phone_number"
          margin="normal"
          value={hailRequest.customer_phone_number}
          onChange={updateField}
          required
        />

        <TextField
          label="Identifiant du client"
          name="customer_id"
          margin="normal"
          value={hailRequest.customer_id}
          onChange={updateField}
          required
        />

        {error && <APIErrorAlert error={error} />}

        <Button type="submit" variant="contained">
          Envoyer la demande de course à {taxi.operator}
        </Button>
      </form>
    </>
  );
}

HailRequestForm.propTypes = {
  customer: PropTypes.shape().isRequired,
  taxi: PropTypes.shape().isRequired,
  onRequest: PropTypes.func.isRequired,
};

export default function StatsTaxiHail() {
  const userContext = React.useContext(UserContext);
  const [center, setCenter] = React.useState(PARIS);
  const [customer, setCustomer] = React.useState({
    lat: center[0],
    lon: center[1],
    phone_number: userContext.user.phone_number_technical || '',
    id: userContext.user.email_technical || userContext.user.email,
  });
  const [selectedTaxi, setSelectedTaxi] = React.useState(null);
  const [currentHail, setCurrentHail] = React.useState();

  React.useEffect(() => {
    reverseGeocode({ lon: customer.lon, lat: customer.lat }).then((address) => {
      setCustomer({ ...customer, address });
    }).catch();
  }, [customer.lon, customer.lat]);

  const mapHandlers = React.useMemo(
    () => ({
      moveend(e) {
        const latlng = e.target.getCenter();
        setCenter([latlng.lat, latlng.lng]);
        setCustomer({ ...customer, lat: latlng.lat, lon: latlng.lng });
      },
    }),
    [],
  );

  const { data, error } = useSWR(
    ['/taxis', userContext.user.apikey, center],
    (url, token) => requestList(url, null, {
      token,
      args: {
        lat: center[0],
        lon: center[1],
      },
    }),
    { refreshInterval: 1000 },
  );

  const wrapApiFunc = React.useCallback(
    () => ({ data, error }),
    [data, error],
  );

  const columns = [
    {
      field: 'id',
      headerName: 'Id taxi',
      flex: 1,
      sortable: false,
    },
    {
      field: 'vehicle',
      headerName: 'Plaque',
      flex: 1,
      sortable: false,
      valueFormatter: ({ value }) => value.licence_plate,
    },
    {
      field: 'crowfly_distance',
      headerName: 'Distance',
      flex: 1,
      sortable: false,
      valueFormatter: ({ value }) => `${value.toFixed(0)} m.`,
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
    <Layout maxWidth="xl">
      <Grid container spacing={2}>
        <Grid item xs>
          <Map center={center} zoom={16}>
            <Circle center={center} radius={500} />
            <Circle center={center} radius={1} />
            {currentHail && <TaxiMarker taxi={currentHail.taxi} taxiIcon={{ html: '🚖' }} />}
            {!currentHail && data?.data.map((taxi) => (
              <TaxiMarker
                taxi={taxi}
                key={taxi.id}
                eventHandlers={{
                  popupopen: () => setSelectedTaxi(taxi),
                  popupclose: () => setSelectedTaxi(null),
                }}
              />
            ))}
            <MapConsumer eventsHandler={mapHandlers} />
          </Map>
        </Grid>
        <Grid item xs>
          <p>
            Adresse&nbsp;: {customer.address || "indéterminée"}
          </p>
          {error && <APIErrorAlert error={error} />}
          {!currentHail && <APIListTable apiFunc={wrapApiFunc} columns={columns} />}
          {selectedTaxi && (
            <Box marginBottom={2}>
              {currentHail ? (
                <HailDetail
                  hailId={currentHail.id}
                  onBackClicked={() => { setCurrentHail(null); setSelectedTaxi(null); }}
                />
              ) : (
                <HailRequestForm
                  customer={customer}
                  taxi={selectedTaxi}
                  onRequest={setCurrentHail}
                />
              )}
            </Box>
          )}
        </Grid>
      </Grid>
    </Layout>
  );
}
