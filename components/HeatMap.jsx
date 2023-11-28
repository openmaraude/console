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
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import BaseMap from '@/components/BaseMap';
import HeatmapLayer from '@/components/HeatmapLayer.ts';
import MapControl from '@/components/MapControl';
import { LYON } from '@/src/utils';

const TaxisSlider = styled(Slider)({
  color: 'purple',
});

export default function HeatMap({
  hails,
  taxis,
  hailsOpacity,
  taxisOpacity,
}) {
  const [hailsMinOpacity, setHailsMinOpacity] = React.useState(hailsOpacity);
  const [taxisMinOpacity, setTaxisMinOpacity] = React.useState(taxisOpacity);
  const [hailsLayer, setHailsLayer] = React.useState();
  const [taxisLayer, setTaxisLayer] = React.useState();

  const handlehailsOpacityChange = (e, value) => {
    setHailsMinOpacity(value);
    hailsLayer.options.minOpacity = value;
  };

  const handleTaxisOpacityChange = (e, value) => {
    setTaxisMinOpacity(value);
    taxisLayer.options.minOpacity = value;
  };

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
            gradient={{ 0.0: 'pink', 1.0: 'purple' }}
            ref={setTaxisLayer}
          />
        </FeatureGroup>
      </LayersControl.Overlay>
      <LayersControl.Overlay name="Hails 🌈" checked>
        <FeatureGroup color="blue">
          <HeatmapLayer
            points={hails}
            latitudeExtractor={(m) => m[0]}
            longitudeExtractor={(m) => m[1]}
            intensityExtractor={() => 3}
            minOpacity={hailsMinOpacity}
            radius={10}
            ref={setHailsLayer}
          />
        </FeatureGroup>
      </LayersControl.Overlay>
      <MapControl>
        <Box sx={{ width: 200 }}>
          <Typography id="input-slider">
            Hails
          </Typography>
          <Slider aria-label="hails" value={hailsMinOpacity} onChange={handlehailsOpacityChange} min={0.0} max={1.0} step={0.1} size="small" />
          <Typography id="input-slider">
            Taxis
          </Typography>
          <TaxisSlider aria-label="taxis" value={taxisMinOpacity} onChange={handleTaxisOpacityChange} min={0.0} max={1.0} step={0.1} size="small" />
        </Box>
      </MapControl>
    </BaseMap>
  );
}

HeatMap.propTypes = {
  hails: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  taxis: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  hailsOpacity: PropTypes.number,
  taxisOpacity: PropTypes.number,
};

HeatMap.defaultProps = {
  hailsOpacity: 0.8,
  taxisOpacity: 0.2,
};
