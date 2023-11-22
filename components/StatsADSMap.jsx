/*
 *
 * This module can't be imported during SSR: https://github.com/PaulLeCam/react-leaflet/issues/45
 * Import with next/dynamic:
 *
 *    dynamic(() => 'components/Map', { ssr: false })
 *
 */

/* eslint-disable new-cap */

import React from 'react';
import PropTypes from 'prop-types';

import L from 'leaflet';
import {
  Marker,
  Tooltip,
  CircleMarker,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import { makeStyles } from 'tss-react/mui';
import BaseMap from './BaseMap';

const useStyles = makeStyles()(() => ({
  markerIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: '3em',
    textAlign: 'center',
  },
}));

function ADS({ department }) {
  const { classes } = useStyles();
  const [lon, lat] = department.position.coordinates;
  const icon = new L.DivIcon({
    className: classes.markerIcon,
    html: department.count,
    iconSize: [16, 16],
    iconAnchor: [24, 12],
  });

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

export default function StatsADSMap({ departments }) {
  return (
    <BaseMap>
      {departments.map((department) => <ADS key={department.insee} department={department} />)}
    </BaseMap>
  );
}

StatsADSMap.propTypes = {
  departments: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};
