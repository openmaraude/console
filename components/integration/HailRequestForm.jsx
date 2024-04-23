import React from 'react';
import PropTypes from "prop-types";

import useSWR from 'swr';

import Button from '@mui/material/Button';
import { makeStyles } from 'tss-react/mui';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import APIErrorAlert from '@/components/APIErrorAlert';
import { reverseGeocode } from '@/src/utils';
import { requestOne } from '@/src/api';
import { UserContext } from '@/src/auth';

const useStyles = makeStyles()(() => ({
  hailRequestForm: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

export default function HailRequestForm({ customer, taxi, onRequest }) {
  const { classes } = useStyles();
  const userContext = React.useContext(UserContext);
  const [hailRequest, setHailRequest] = React.useState({
    lon: customer?.lon, // Not update when the textfields change
    lat: customer?.lat,
    customer_address: '', // Will be reversed geocoded
    customer_phone_number: '0607080910',
    customer_id: (Math.random() * 100000000).toFixed(0).toString(),
  });
  const [error, setError] = React.useState();

  // Probably not elegant, but that's the best I found for a one-time call at loading this component
  // I don't prevent refreshing the data, but I prevent spamming the API
  useSWR(
    [hailRequest.lon, hailRequest.lat],
    (lon, lat) => reverseGeocode({ lon, lat }).then((address) => {
      setHailRequest({ ...hailRequest, customer_address: address });
    }).catch(),
    { refreshInterval: 0, revalidateOnFocus: false },
  );

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

  const updateField = (e) => {
    setHailRequest({
      ...hailRequest,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Typography variant="h5">Envoyer une demande de course au taxi {taxi.id} ({taxi.operator})</Typography>

      <form className={classes.hailRequestForm} onSubmit={onSubmit}>
        <TextField
          label="Longitude du client"
          name="lon"
          type="number"
          // There is an issue with Safari using this step as the valid pattern, 6 decimal places
          // but a lat/lon can use more digits, and Safari will refuse to submit the form.
          inputProps={{ step: "any" }}
          margin="normal"
          value={hailRequest.lon}
          onChange={updateField}
          required
        />

        <TextField
          label="Latitude du client"
          name="lat"
          type="number"
          inputProps={{ step: "any" }}
          margin="normal"
          value={hailRequest.lat}
          onChange={updateField}
          required
        />

        <TextField
          label="Adresse du client"
          name="customer_address"
          margin="normal"
          value={hailRequest.customer_address}
          onChange={updateField}
          required
        />

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

        <small>
          Attention: la demande de course ne peut fonctionner que si le taxi a
          le statut <strong>free</strong> et que sa géolocalisation a été mise
          à jour il y a moins de deux minutes.
        </small>

        <Button type="submit" variant="contained">
          Envoyer la demande de course à {taxi.operator}
        </Button>
      </form>
    </>
  );
}

HailRequestForm.propTypes = {
  customer: PropTypes.shape({
    lon: PropTypes.number,
    lat: PropTypes.number,
  }).isRequired,
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
