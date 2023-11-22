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
  Tooltip,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import BaseMap from './BaseMap';

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
  return (
    <BaseMap>
      {zupcs.map((zupc) => <ZUPC key={zupc.id} zupc={zupc} />)}
    </BaseMap>
  );
}

StatsMap.propTypes = {
  zupcs: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};
