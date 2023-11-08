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

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { makeStyles } from 'tss-react/mui';

import {
  MapContainer,
  TileLayer,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import SearchAddressDialog from '@/components/SearchAddressDialog';
import HeatmapLayer from '@/components/HeatmapLayer.ts';
import { MIDDLE_FRANCE } from '@/src/utils';

const useStyles = makeStyles()((theme) => ({
  mapButtons: {
    marginBottom: theme.spacing(1),

    '& > *': {
      marginRight: theme.spacing(1),
    },
  },
}));

export default function HeatMap({
  points,
  center,
  zoom,
  intensity,
  minOpacity,
  radius,
}) {
  const mapboxTileLayer = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}';
  const [mapInstance, setMapInstance] = React.useState();
  const [searchDialog, setSearchDialog] = React.useState(false);
  const { classes } = useStyles();

  const onSearch = (address) => {
    if (address) {
      const [lon, lat] = address.geometry.coordinates;
      mapInstance.flyTo([lat, lon], 18, { animate: true });
    }
    setSearchDialog(false);
  };

  return (
    <div>
      <Box className={classes.mapButtons}>
        <Button variant="contained" onClick={() => setSearchDialog(true)}>
          Chercher une adresse
        </Button>
      </Box>

      <MapContainer
        center={center}
        minZoom={5}
        maxZoom={18}
        zoom={zoom}
        style={{ height: 700, width: "100%" }}
        attributionControl={false}
        ref={setMapInstance}
      >
        <TileLayer
          url={mapboxTileLayer}
          accessToken={process.env.MAPBOX_TOKEN}
          id="mapbox/streets-v11"
        />
        <HeatmapLayer
          points={points}
          latitudeExtractor={(m) => m[0]}
          longitudeExtractor={(m) => m[1]}
          intensityExtractor={() => intensity}
          minOpacity={minOpacity}
          radius={radius}
        />
      </MapContainer>
      <SearchAddressDialog open={searchDialog} onClose={onSearch} />
    </div>
  );
}

HeatMap.propTypes = {
  points: PropTypes.arrayOf(PropTypes.arrayOf([PropTypes.number, PropTypes.number])).isRequired,
  center: PropTypes.arrayOf([PropTypes.number, PropTypes.number]),
  zoom: PropTypes.number,
  intensity: PropTypes.number,
  minOpacity: PropTypes.number,
  radius: PropTypes.number,
};

HeatMap.defaultProps = {
  center: MIDDLE_FRANCE, // Metropolitan France center
  zoom: 6,
  intensity: 3,
  minOpacity: 0.8,
  radius: 10,
};
