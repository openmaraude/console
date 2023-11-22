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
  LayersControl,
  MapContainer,
  TileLayer,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import SearchAddressDialog from '@/components/SearchAddressDialog';
import { MIDDLE_FRANCE } from '@/src/utils';

const useStyles = makeStyles()((theme) => ({
  mapButtons: {
    marginBottom: theme.spacing(1),

    '& > *': {
      marginRight: theme.spacing(1),
    },
  },
}));

export default function BaseMap({
  center,
  zoom,
  children,
}) {
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
        ref={setMapInstance}
      >
        <LayersControl>
          <LayersControl.BaseLayer name="Mapbox" checked>
            <TileLayer
              url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}"
              accessToken={process.env.MAPBOX_TOKEN}
              id="mapbox/streets-v12"
              attribution={`
                &copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>
                &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>
              `}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="OpenStreetmap">
            <TileLayer
              url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
              attribution="&copy; <a href=http://osm.org/copyright>OpenStreetMap</a> contributors"
            />
          </LayersControl.BaseLayer>
          {children}
        </LayersControl>
      </MapContainer>
      <SearchAddressDialog open={searchDialog} onClose={onSearch} />
    </div>
  );
}

BaseMap.propTypes = {
  center: PropTypes.arrayOf([PropTypes.number, PropTypes.number]),
  zoom: PropTypes.number,
  children: PropTypes.node.isRequired,
};

BaseMap.defaultProps = {
  center: MIDDLE_FRANCE, // Metropolitan France center
  zoom: 6, // Enough to fit Metropolitan France
};
