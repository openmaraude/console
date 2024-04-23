/* eslint-disable new-cap */

import React from 'react';
import PropTypes from 'prop-types';

import { GeoJSON, Tooltip } from './MapComponents';

export default function ZUPC({ zupc }) {
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
