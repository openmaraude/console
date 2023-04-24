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

const MID_FRANCE = [46.536, 2.4302];

function ZUPC({ zupc }) {
  return (
    <GeoJSON key={zupc.id} data={zupc.geojson}>
      <Tooltip offset={[0, 20]} opacity={1}>
        <p>
          <strong>{zupc.nom}</strong>
          {zupc.stats.total !== undefined && (
            <>
              <br />
              <i>{zupc.stats.total}</i> taxis connectés
            </>
          )}
        </p>
      </Tooltip>
    </GeoJSON>
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
          accessToken={process.env.MAPBOX_TOKEN}
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
