import React from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Slider,
} from '@mui/material';

import faker from 'faker/locale/fr';

import SearchAddressDialog from '@/components/SearchAddressDialog';

import { requestOne } from '@/src/api';
import { UserContext } from '@/src/auth';
import { departementCode } from '@/src/utils';
import APIErrorAlert from './APIErrorAlert';

export default function CreateIntegrationTaxi({ open, onClose }) {
  const userContext = React.useContext(UserContext);
  const [error, setError] = React.useState();

  const [taxiRequest, setTaxiRequest] = React.useState({
    nb_seats: 4,
    insee: '75056',
    name: 'Paris (75)',
    bank_check_accepted: false,
    baby_seat: false,
    bike_accepted: false,
    pet_accepted: false,
    amex_accepted: false,
    wifi: false,
    vasp_handicap: true,
  });

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
        licence_plate: faker.vehicle.vrm(),
        color: faker.vehicle.color(),
        nb_seats: taxiRequest.nb_seats,
        bank_check_accepted: taxiRequest.bank_check_accepted,
        baby_seat: taxiRequest.baby_seat,
        bike_accepted: taxiRequest.bike_accepted,
        pet_accepted: taxiRequest.pet_accepted,
        amex_accepted: taxiRequest.pet_accepted,
        wifi: taxiRequest.wifi,
        vasp_handicap: taxiRequest.vasp_handicap,
      });

      const ads = await doPOSTRequest('/ads', {
        insee: taxiRequest.insee,
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
      onClose();
    } catch (err) {
      setError(err);
    }
  };

  const [searchDialog, setSearchDialog] = React.useState(false);
  const onSearch = (address) => {
    if (address && address.properties && address.properties.citycode) {
      const depCode = departementCode(address.properties.citycode);
      setTaxiRequest({
        ...taxiRequest,
        insee: address.properties.citycode,
        name: `${address.properties.city} (${depCode})`,
      });
    }
    setSearchDialog(false);
  };

  const handleTaxiRequestChange = (event) => {
    if (event.target.name === 'nb_seats') {
      setTaxiRequest({
        ...taxiRequest,
        [event.target.name]: event.target.value,
      });
    } else {
      setTaxiRequest({
        ...taxiRequest,
        [event.target.name]: event.target.checked,
      });
    }
  };

  return (
    <>
      <Dialog onClose={onClose} open={open} PaperProps={{ component: 'form' }}>
        <DialogTitle>Créer un nouveau taxi</DialogTitle>
        <DialogContent>
          <p>
            <FormControl>
              <FormLabel>Nombre de places</FormLabel>
              <Slider
                name="nb_seats"
                value={taxiRequest.nb_seats}
                min={1}
                max={8}
                step={1}
                valueLabelDisplay="auto"
                onChange={handleTaxiRequestChange}
              />
            </FormControl>
          </p>
          <p>
            <FormControl>
              <FormLabel>Caractéristiques</FormLabel>
              <FormGroup row>
                <FormControlLabel label="Chèque accepté" control={<Checkbox name="bank_check_accepted" checked={taxiRequest.bank_check_accepted} onChange={handleTaxiRequestChange} />} />
                <FormControlLabel label="Siège bébé" control={<Checkbox name="baby_seat" checked={taxiRequest.baby_seat} onChange={handleTaxiRequestChange} />} />
                <FormControlLabel label="Vélo accepté" control={<Checkbox name="bike_accepted" checked={taxiRequest.bike_accepted} onChange={handleTaxiRequestChange} />} />
                <FormControlLabel label="Animal de compagnie accepté" control={<Checkbox name="pet_accepted" checked={taxiRequest.pet_accepted} onChange={handleTaxiRequestChange} />} />
                <FormControlLabel label="American Express acceptée" control={<Checkbox name="amex_accepted" checked={taxiRequest.amex_accepted} onChange={handleTaxiRequestChange} />} />
                <FormControlLabel label="Wi-Fi à bord" control={<Checkbox name="wifi" checked={taxiRequest.wifi} onChange={handleTaxiRequestChange} />} />
                <FormControlLabel label="VASP handicap*" control={<Checkbox name="vasp_handicap" checked={taxiRequest.vasp_handicap} onChange={handleTaxiRequestChange} />} />
              </FormGroup>
              <FormHelperText>
                * Carte grise catégorie VASP (J1) carrosserie handicap (J3)
              </FormHelperText>
            </FormControl>
          </p>
          <p>
            <FormControl>
              <FormLabel>
                Commune de délivrance de l'ADS qui détermine la zone de prise en charge
              </FormLabel>
              <Button variant="contained" color="secondary" size="small" onClick={() => setSearchDialog(true)}>{taxiRequest.name}</Button>
            </FormControl>
          </p>
          {error && <APIErrorAlert error={error} />}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" size="small" onClick={createIntegrationTaxi}>
            créer un taxi avec ces caractéristiques
          </Button>

        </DialogActions>
      </Dialog>
      <SearchAddressDialog open={searchDialog} onClose={onSearch} type="municipality" dialogContentText="" />
    </>
  );
}

CreateIntegrationTaxi.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
