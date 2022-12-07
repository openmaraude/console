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
  MapContainer,
  TileLayer,
  Tooltip,
  CircleMarker,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import { makeStyles } from 'tss-react/mui';

const MID_FRANCE = [46.536, 2.4302];

const useStyles = makeStyles()(() => ({
  markerIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: '3em',
    textAlign: 'center',
  },
}));

function Taxi({ taxi }) {
  const { classes } = useStyles();
  const [lon, lat] = taxi.position.coordinates;
  const icon = new L.DivIcon({
    className: classes.markerIcon,
    html: taxi.count,
    iconSize: [16, 16],
    iconAnchor: [24, 12],
  });

  return (
    <Marker key={taxi.insee} position={[lat, lon]} icon={icon}>
      <CircleMarker key={taxi.insee} center={[lat, lon]} radius={16} />
      <Tooltip offset={[20, 0]} opacity={1}>
        <p>
          <strong>{taxi.name}</strong>
          <br />
          {`${taxi.count} taxis`}
        </p>
      </Tooltip>
    </Marker>
  );
}

Taxi.propTypes = {
  taxi: PropTypes.shape({
    count: PropTypes.number,
    insee: PropTypes.string,
    position: PropTypes.shape({
      type: PropTypes.string,
      coordinates: PropTypes.arrayOf(PropTypes.number),
    }),
    name: PropTypes.string,
  }).isRequired,
};

export default function TaxiStatsMap({ taxis }) {
  // We haven't changed this token for years. If you need to update the token
  // in the future, maybe you should consider setting it in process.env.
  const mapboxToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
  const mapboxTileLayer = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}';

  return (
    <div>
      <MapContainer
        center={MID_FRANCE}
        minZoom={4}
        maxZoom={16}
        zoom={6}
        style={{ height: 600, width: "100%" }}
        attributionControl={false}
      >
        <TileLayer
          url={mapboxTileLayer}
          accessToken={mapboxToken}
          id="mapbox/streets-v11"
        />
        {taxis.map((taxi) => <Taxi key={taxi.insee} taxi={taxi} />)}
      </MapContainer>
    </div>
  );
}

TaxiStatsMap.propTypes = {
  taxis: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};
