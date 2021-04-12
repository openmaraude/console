import React from 'react';
import PropTypes from 'prop-types';

import useSWR from 'swr';

import Avatar from '@material-ui/core/Avatar';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DirectionsIcon from '@material-ui/icons/Directions';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';

import APIErrorAlert from './APIErrorAlert';
import { TimeoutGroup, TimeoutTextField } from './TimeoutForm';

const useStyles = makeStyles((theme) => ({
  address: {
    '&:hover': {
      backgroundColor: theme.palette.secondary.light,
      color: theme.palette.secondary.contrastText,
      cursor: 'pointer',
    },
  },

  addressAvatar: {
    color: theme.palette.primary.main,
    backgroundColor: '#fff',
  },
}));

function Address({ address, onClick }) {
  const classes = useStyles();
  return (
    <ListItem className={classes.address} onClick={onClick}>
      <ListItemAvatar>
        <Avatar className={classes.addressAvatar}>
          <DirectionsIcon color="primary" />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={address.properties.name}
        secondary={`${address.properties.postcode} ${address.properties.city}`}
      />
    </ListItem>
  );
}

Address.propTypes = {
  address: PropTypes.shape({
    properties: PropTypes.shape({
      name: PropTypes.string,
      postcode: PropTypes.string,
      city: PropTypes.string,
    }),
  }).isRequired,

  onClick: PropTypes.func.isRequired,
};

export default function SearchAddressDialog({ open, onClose }) {
  const API_URL = 'https://api-adresse.data.gouv.fr';
  const [searchAddress, setSearchAddress] = React.useState();

  const search = async (filters) => {
    setSearchAddress(filters.address);
  };

  // Use api-adresse.data.gouv.fr to search for address
  const { data, error } = useSWR(
    [searchAddress],
    async (address) => {
      if (!address) {
        return null;
      }

      const url = new URL(`${API_URL}/search`);
      url.searchParams.append('q', address);

      const resp = await fetch(url);

      if (!resp.ok) {
        throw new Error(`api-adresse.data.gouv.fr a retourné une erreur ${resp.status}`);
      }

      const geoJSON = await resp.json();
      return geoJSON.features;
    },
    { revalidateOnFocus: false },
  );

  return (
    <Dialog open={open} onClose={() => onClose(null)} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Rechercher une adresse</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Entrez une adresse pour positionner la carte à l'endroit voulu.
        </DialogContentText>
        <TimeoutGroup onSubmit={search}>
          <TimeoutTextField
            autoFocus
            margin="dense"
            id="address"
            name="address"
            label="Adresse"
            fullWidth
          />
        </TimeoutGroup>

        {error && <APIErrorAlert error={error} />}

        {data && (
          <List>
            {data.map((address) => (
              <Address
                key={address.properties.id}
                address={address}
                onClick={() => onClose(address)}
              />
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
}

SearchAddressDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
