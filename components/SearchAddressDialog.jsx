import React from 'react';
import PropTypes from 'prop-types';

import useSWR from 'swr';

import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DirectionsIcon from '@mui/icons-material/Directions';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import { makeStyles } from 'tss-react/mui';

import APIErrorAlert from '@/components/APIErrorAlert';
import { TimeoutGroup, TimeoutTextField } from '@/components/TimeoutForm';

const useStyles = makeStyles()((theme) => ({
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
  const { classes } = useStyles();
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

export default function SearchAddressDialog({ open, onClose, type, dialogContentText }) {
  const API_URL = 'https://api-adresse.data.gouv.fr';
  const [searchAddress, setSearchAddress] = React.useState();

  const search = async (filters) => {
    setSearchAddress(filters.address);
  };

  // Use api-adresse.data.gouv.fr to search for address
  const { data, error } = useSWR(
    [searchAddress, API_URL],
    async (address) => {
      if (!address || address.length < 3) {
        return null;
      }

      const url = new URL(`${API_URL}/search?type=${type}`);
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
    <Dialog
      open={open}
      aria-labelledby="form-dialog-title"
      onClose={() => onClose(null)}
    >
      <DialogTitle id="form-dialog-title">Rechercher une adresse</DialogTitle>
      <DialogContent>
        <DialogContentText>{dialogContentText}</DialogContentText>
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
  type: PropTypes.oneOf(['', 'housenumber', 'street', 'locality', 'municipality']),
  dialogContentText: PropTypes.string,
};

SearchAddressDialog.defaultProps = {
  type: '',  // Not the same as 'housenumber', but a bit of all types at once
  dialogContentText: "Entrez une adresse pour positionner la carte à l'endroit voulu.",
};
