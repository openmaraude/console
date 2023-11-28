/*
 *
 * This module can't be imported during SSR: https://github.com/PaulLeCam/react-leaflet/issues/45
 * Import with next/dynamic:
 *
 *    dynamic(() => 'components/Map', { ssr: false })
 *
 */

/* eslint-disable new-cap */

import PropTypes from 'prop-types';
import React from 'react';

import { FeatureGroup, LayersControl } from 'react-leaflet';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import BaseMap from '@/components/BaseMap';
import HailsHeatmap from '@/components/HailsHeatmap';
import TaxisHeatmap from '@/components/TaxisHeatmap';
import MapControl from '@/components/MapControl';

const TaxisSlider = styled(Slider)({
  color: 'purple',
});

export default function HeatMaps({ center, zoom }) {
  const [hailsMinOpacity, setHailsMinOpacity] = React.useState(0.8);
  const [taxisMinOpacity, setTaxisMinOpacity] = React.useState(0.2);

  return (
    <BaseMap center={center} zoom={zoom}>
      <LayersControl.Overlay name="Taxis 🟣" checked>
        <FeatureGroup color="purple">
          <TaxisHeatmap minOpacity={taxisMinOpacity} />
        </FeatureGroup>
      </LayersControl.Overlay>
      <LayersControl.Overlay name="Hails 🌈" checked>
        <FeatureGroup color="blue">
          <HailsHeatmap minOpacity={hailsMinOpacity} />
        </FeatureGroup>
      </LayersControl.Overlay>
      <MapControl>
        <Box sx={{ width: 200 }}>
          <Typography id="input-slider">
            Hails
          </Typography>
          <Slider aria-label="hails" defaultValue={hailsMinOpacity} onChange={(e, v) => setHailsMinOpacity(v)} min={0.0} max={1.0} step={0.1} size="small" />
          <Typography id="input-slider">
            Taxis
          </Typography>
          <TaxisSlider aria-label="taxis" defaultValue={taxisMinOpacity} onChange={(e, v) => setTaxisMinOpacity(v)} min={0.0} max={1.0} step={0.1} size="small" />
        </Box>
      </MapControl>
    </BaseMap>
  );
}

HeatMaps.propTypes = {
  center: PropTypes.arrayOf(PropTypes.number).isRequired,
  zoom: PropTypes.number.isRequired,
};
