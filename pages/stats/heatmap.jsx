import dynamic from 'next/dynamic';
import React from 'react';

import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import Map from '@/components/map/Map';
import {
  Overlay,
  FeatureGroup,
  LayersControl,
} from '@/components/map/MapComponents';
import { LYON } from '@/src/utils';
import { Layout } from './index';

const TaxisSlider = styled(Slider)({
  color: 'purple',
});

export default function StatsHeatMap() {
  const [hailsMinOpacity, setHailsMinOpacity] = React.useState(0.8);
  const [taxisMinOpacity, setTaxisMinOpacity] = React.useState(0.2);

  const TaxisHeatmap = dynamic(
    () => import('@/components/map/TaxisHeatmap'),
    { ssr: false },
  );
  const HailsHeatmap = dynamic(
    () => import('@/components/map/HailsHeatmap'),
    { ssr: false },
  );
  const MapControl = dynamic(
    () => import('@/components/map/MapControl'),
    { ssr: false },
  );

  return (
    <Layout maxWidth="xl">
      <p>
        Cette carte affiche les points chauds de demandes prise en charge 🌈
        (abouties ou non) et des taxis en ligne 🟣.
      </p>
      <Map center={LYON} zoom={12}>
        <LayersControl>
          <Overlay name="Taxis 🟣" checked>
            <FeatureGroup color="purple">
              <TaxisHeatmap minOpacity={taxisMinOpacity} />
            </FeatureGroup>
          </Overlay>
          <Overlay name="Hails 🌈" checked>
            <FeatureGroup color="blue">
              <HailsHeatmap minOpacity={hailsMinOpacity} />
            </FeatureGroup>
          </Overlay>
        </LayersControl>
        <MapControl position="bottomleft">
          <Box sx={{ width: 200, padding: '0 10px' }}>
            <Typography id="input-slider-hails">
              Hails
            </Typography>
            <Slider aria-label="hails" defaultValue={hailsMinOpacity} onChange={(e, v) => setHailsMinOpacity(v)} min={0.0} max={1.0} step={0.1} size="small" />
            <Typography id="input-slider-taxis">
              Taxis
            </Typography>
            <TaxisSlider aria-label="taxis" defaultValue={taxisMinOpacity} onChange={(e, v) => setTaxisMinOpacity(v)} min={0.0} max={1.0} step={0.1} size="small" />
          </Box>
        </MapControl>
      </Map>
    </Layout>
  );
}
