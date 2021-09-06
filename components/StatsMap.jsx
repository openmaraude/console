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
  GeoJSON,
  MapContainer,
  TileLayer,
  Tooltip,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MID_FRANCE = [46.23, 2.20];

function ZUPC({ zupc }) {
  return (
    <>
      <GeoJSON key={zupc.id} data={zupc.geojson}>
        <Tooltip offset={[0, 20]} opacity={1}>
          <p>
            <strong>{zupc.nom}</strong>
            {zupc.stats.total !== undefined && <>
                <br />
                <i>{zupc.stats.total}</i> taxis connectés
            </>}
          </p>
        </Tooltip>
      </GeoJSON>
    </>
  );
}

ZUPC.propTypes = {
  zupc: PropTypes.shape({
    id: PropTypes.string,
    nom: PropTypes.string,
    geojson: PropTypes.shape({}),
    stats: PropTypes.shape({
      total: PropTypes.number,
    }),
  }).isRequired,
};

export default function StatsMap({ zupcs }) {
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
        {zupcs.map((zupc) => <ZUPC key={zupc.id} zupc={zupc} />)}
      </MapContainer>
    </div>
  );
}

StatsMap.propTypes = {
  zupcs: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};
