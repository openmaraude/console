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
  MapContainer,
  Marker,
  Polygon,
  TileLayer,
  Tooltip,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import MarkerClusterGroup from '@/components/ReactLeafletCluster';

import StationIcon from '@/public/images/station.png';
import StationShadow from '@/public/images/shadow.png';

const MID_FRANCE = [46.536, 2.4302];

function Station({ station }) {
  const stationIcon = new L.Icon({
    iconUrl: StationIcon.src,
    iconSize: [StationIcon.width / 2, StationIcon.height / 2],
    iconAnchor: [StationIcon.width / 4, StationIcon.height / 2],
    shadowUrl: StationShadow.src,
    shadowSize: [StationShadow.width / 4, StationShadow.height / 4],
    shadowAnchor: [0, StationShadow.height / 4],
  });

  const showPlaces = (places) => {
    if (!places) return '';
    if (places === 1) return <i>une place</i>;
    return <i>{places} places</i>;
  };

  if (station.geojson.type === 'Point') {
    const lon = station.geojson.coordinates[0];
    const lat = station.geojson.coordinates[1];
    return (
      <Marker key={station.id} position={[lat, lon]} icon={stationIcon}>
        <Tooltip offset={[0, 20]} opacity={1}>
          <p>
            <strong>{station.name}</strong>
            <br />
            {showPlaces(station.places)}
          </p>
        </Tooltip>
      </Marker>
    );
  }
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
}

Station.propTypes = {
  station: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    places: PropTypes.number,
    geojson: PropTypes.shape({
      type: PropTypes.string,
      coordinates: PropTypes.shape([]),
    }),
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