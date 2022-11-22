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

import {
  MapContainer,
  Marker,
  Polygon,
  TileLayer,
  Tooltip,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import MarkerClusterGroup from '@/components/ReactLeafletCluster';

import { makeStyles } from 'tss-react/mui';

const MID_FRANCE = [46.536, 2.4302];

const useStyles = makeStyles()((theme) => ({
  taxiIcon: {
    fontSize: '32px',
  },
}));

function Station({ station }) {
  const { classes } = useStyles();

  const taxiIcon = new L.divIcon({
    className: classes.taxiIcon,
    html: '🅿️',
    iconSize: [32, 32],
    iconAnchor: [32 / 2, 32],
  });

  const showPlaces = (places) => {
    switch (places) {
      case undefined:
      case 0:
        return;
      case 1:
        return <i>une place</i>;
        break;
      default:
        return <i>{places} places</i>;
    };
  }

  switch (station.geojson.type) {
    case 'Point':
      const lon = station.geojson.coordinates[0];
      const lat = station.geojson.coordinates[1];
      return (
        <Marker key={station.id} position={[lat, lon]} icon={taxiIcon}>
          <Tooltip offset={[0, 20]} opacity={1}>
            <p>
              <strong>{station.name}</strong>
              <br />
              {showPlaces(station.places)}
            </p>
          </Tooltip>
        </Marker>
      );
    default:
      return (
        <Polygon positions={station.geojson.coordinates}>
          <Tooltip offset={[0, 20]} opacity={1}>
            <p>
              <strong>{station.name}</strong>
              {station.places !== undefined && (
                <>
                  <br />
                  <i>{station.places}</i> places
                </>
              )}
              <br />
              {JSON.stringify(station.geojson)}
            </p>
          </Tooltip>
        </Polygon>
      );
  };
}

Station.propTypes = {
  station: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    places: PropTypes.number,
    geojson: PropTypes.shape({}),
  }).isRequired,
};

export default function StationsMap({ stations }) {
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
        <MarkerClusterGroup chunkedLoading removeOutsideVisibleBounds disableClusteringAtZoom={12}>
          {stations.map((station) => <Station key={station.id} station={station} />)}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}

StationsMap.propTypes = {
  stations: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};
