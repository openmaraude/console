/* eslint-disable new-cap */

import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from 'tss-react/mui';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import { UserContext, hasRole } from '@/src/auth';
import { formatLoc } from '@/src/utils';
import {
  Circle,
  Marker,
  Popup,
} from './MapComponents';

const useStyles = makeStyles()(() => ({
  taxiIcon: {
    fontSize: '32px',
  },
}));

export default function TaxiMarker({ taxi, ...props }) {
  const { user } = React.useContext(UserContext);
  const { classes } = useStyles();
  const taxiIcon = {
    className: classes.taxiIcon,
    html: '🚕',
    iconSize: [32, 32],
    iconAnchor: [32 / 2, 32],
    ...props?.taxiIcon,
  };

  return (
    <Marker
      position={[taxi.position?.lat, taxi.position?.lon]}
      icon={taxiIcon}
      style={{ zIndex: '1!important' }}
      {...props}
    >
      <Circle
        center={taxi.position}
        radius={taxi.radius || 500}
        pathOptions={{ color: '#edd400' }}
      />
      <Popup>
        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell variant="head">Taxi ID</TableCell>
              <TableCell>{taxi.id}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell variant="head">Opérateur</TableCell>
              <TableCell>{taxi.operator}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell variant="head">Statut</TableCell>
              <TableCell>{taxi.status}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell variant="head">Rayon</TableCell>
              <TableCell>{taxi.radius ? (<>{taxi.radius} m.</>) : (<i>par défaut</i>)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell variant="head">Position</TableCell>
              <TableCell>
                {formatLoc(taxi.position?.lon, 3)},&nbsp;
                {formatLoc(taxi.position?.lat, 3)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell variant="head">Distance</TableCell>
              <TableCell>{taxi.crowfly_distance.toFixed(0)} m.</TableCell>
            </TableRow>
            {hasRole(user, 'admin') && (
              <TableRow>
                <TableCell variant="head">Plaque</TableCell>
                <TableCell>{taxi.vehicle.licence_plate}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Popup>
    </Marker>
  );
}

TaxiMarker.propTypes = {
  taxi: PropTypes.shape().isRequired,
  taxiIcon: PropTypes.shape(),
};

TaxiMarker.defaultProps = {
  taxiIcon: null,
};
