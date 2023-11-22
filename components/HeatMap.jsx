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

import { FeatureGroup, LayersControl } from 'react-leaflet';

import BaseMap from '@/components/BaseMap';
import HeatmapLayer from '@/components/HeatmapLayer.ts';
import { LYON } from '@/src/utils';

export default function HeatMap({
  hails,
  taxis,
  hailsMinOpacity,
  taxisMinOpacity,
}) {
  return (
    <BaseMap center={LYON} zoom={12}>
      <LayersControl.Overlay name="Taxis 🟣" checked>
        <FeatureGroup color="purple">
          <HeatmapLayer
            points={taxis}
            latitudeExtractor={(m) => m[0]}
            longitudeExtractor={(m) => m[1]}
            intensityExtractor={() => 3}
            minOpacity={taxisMinOpacity}
            radius={10}
            gradient={{ [taxisMinOpacity]: 'pink', 1.0: 'purple' }}
          />
        </FeatureGroup>
      </LayersControl.Overlay>
      <LayersControl.Overlay name="Hails 🔵" checked>
        <FeatureGroup color="blue">
          <HeatmapLayer
            points={hails}
            latitudeExtractor={(m) => m[0]}
            longitudeExtractor={(m) => m[1]}
            intensityExtractor={() => 3}
            minOpacity={hailsMinOpacity}
            radius={10}
          />
        </FeatureGroup>
      </LayersControl.Overlay>
    </BaseMap>
  );
}

HeatMap.propTypes = {
  hails: PropTypes.arrayOf(PropTypes.arrayOf([PropTypes.number, PropTypes.number])).isRequired,
  taxis: PropTypes.arrayOf(PropTypes.arrayOf([PropTypes.number, PropTypes.number])).isRequired,
  hailsMinOpacity: PropTypes.number,
  taxisMinOpacity: PropTypes.number,
};

HeatMap.defaultProps = {
  hailsMinOpacity: 0.8,
  taxisMinOpacity: 0.2,
};
