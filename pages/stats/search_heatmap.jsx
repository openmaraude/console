import dynamic from 'next/dynamic';
import React from 'react';

import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

import Map from '@/components/map/Map';
import {
  Overlay,
  FeatureGroup,
  LayersControl,
} from '@/components/map/MapComponents';
import { LYON } from '@/src/utils';
import { Layout } from './index';

export default function DemandHeatMap() {
  const [minOpacity, setMinOpacity] = React.useState(0.5);

  const SearchHeatmap = dynamic(
    () => import('@/components/map/SearchHeatmap'),
    { ssr: false },
  );
  const MapControl = dynamic(
    () => import('@/components/map/MapControl'),
    { ssr: false },
  );

  return (
    <Layout maxWidth="xl">
      <p>
        Cette carte affiche les points chauds de recherches de taxi
        (abouties ou non).
      </p>
      <Map center={LYON} zoom={12}>
        <LayersControl>
          <Overlay name="Recherches" checked>
            <FeatureGroup color="red">
              <SearchHeatmap minOpacity={minOpacity} />
            </FeatureGroup>
          </Overlay>
        </LayersControl>
        <MapControl position="bottomleft">
          <Box sx={{ width: 200, padding: '0 10px' }}>
            <Typography id="input-slider-search">
              Recherches
            </Typography>
            <Slider aria-label="search" defaultValue={minOpacity} onChange={(e, v) => setMinOpacity(v)} min={0.0} max={1.0} step={0.1} size="small" />
          </Box>
        </MapControl>
      </Map>
    </Layout>
  );
}
