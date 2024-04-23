/* eslint-disable new-cap */

import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from 'tss-react/mui';

import { Marker, Tooltip, CircleMarker } from '@/components/map/MapComponents';

const useStyles = makeStyles()(() => ({
  markerIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: '3em',
    textAlign: 'center',
  },
}));

export default function ADS({ department }) {
  const { classes } = useStyles();
  const [lon, lat] = department.position.coordinates;
  const icon = {
    className: classes.markerIcon,
    html: department.count,
    iconSize: [16, 16],
    iconAnchor: [24, 12],
  };

  return (
    <CircleMarker
      center={[lat, lon]}
      radius={Math.floor(12 + 2 * Math.log(department.count))}
      stroke={false}
      fillColor="#edd400"
      fillOpacity={1.0}
    >
      <Marker position={[lat, lon]} icon={icon}>
        <Tooltip offset={[20, 0]} opacity={1}>
          <p>
            <strong>{department.name}</strong>
            <br />
            {`${department.count} taxis`}
          </p>
        </Tooltip>
      </Marker>
    </CircleMarker>
  );
}

ADS.propTypes = {
  department: PropTypes.shape({
    count: PropTypes.number,
    insee: PropTypes.string,
    position: PropTypes.shape({
      type: PropTypes.string,
      coordinates: PropTypes.arrayOf(PropTypes.number),
    }),
    name: PropTypes.string,
  }).isRequired,
};
