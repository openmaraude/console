// https://placekit.io/blog/articles/making-react-leaflet-work-with-nextjs-493i
import PropTypes from 'prop-types';
import React from 'react';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import GpsFixed from '@mui/icons-material/GpsFixed';
import 'leaflet/dist/leaflet.css';

// import and use components as usual
import SearchAddressDialog from '@/components/SearchAddressDialog';
import { MIDDLE_FRANCE } from '@/src/utils';
import {
  MapContainer,
  TileLayer,
  ZoomControl,
  LayersControl,
  BaseLayer,
  MapConsumer,
} from './MapComponents';

function Map({ children, ...props }) {
  const mapRef = React.useRef(null);
  const [searchDialog, setSearchDialog] = React.useState(false);

  const onSearch = (address) => {
    if (address) {
      const [lon, lat] = address.geometry.coordinates;
      mapRef.current.flyTo([lat, lon], 18, { animate: true });
    }
    setSearchDialog(false);
  };

  const mapHandlers = React.useMemo(
    () => ({
      // click(e) {
      //   mapRef.current.setView(e.latlng);
      // },
      locationfound(e) {
        mapRef.current.flyTo(e.latlng);
      },
    }),
    [mapRef],
  );

  return (
    <>
      <MapContainer
        ref={mapRef}
        touchZoom={false}
        zoomControl={false}
        // scrollWheelZoom={false}
        style={{ height: '700px', width: '100%', zIndex: '0!important' }}
        {...props}
      >
        <LayersControl>
          <BaseLayer name="Mapbox" checked>
            <TileLayer
              url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}"
              accessToken={process.env.MAPBOX_TOKEN}
              id="mapbox/streets-v12"
              attribution={`
                &copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>
                &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>
              `}
              style={{ zIndex: '0!important' }}
            />
          </BaseLayer>
          <BaseLayer name="OpenStreetmap">
            <TileLayer
              url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
              attribution="&copy; <a href=http://osm.org/copyright>OpenStreetMap</a> contributors"
              style={{ zIndex: '0!important' }}
            />
          </BaseLayer>
        </LayersControl>
        {/* Don't use MapControl while it flickers */}
        <div className="leaflet-top leaflet-left" style={{ zIndex: '10!important' }}>
          <div className="leaflet-control-layers leaflet-control">
            <Button variant="contained" onClick={() => setSearchDialog(true)}>
              Chercher une adresse
            </Button>
            <IconButton variant="contained" title="Me localiser" onClick={() => mapRef.current.locate()}>
              <GpsFixed />
            </IconButton>
          </div>
        </div>
        {children}
        <ZoomControl position="topright" style={{ zIndex: '10!important' }} />
        <MapConsumer eventsHandler={mapHandlers} />
      </MapContainer>
      <SearchAddressDialog open={searchDialog} onClose={onSearch} />
    </>
  );
}

Map.propTypes = {
  center: PropTypes.arrayOf(PropTypes.number),
  zoom: PropTypes.number,
  children: PropTypes.node.isRequired,
};

Map.defaultProps = {
  center: MIDDLE_FRANCE, // Metropolitan France center
  zoom: 6, // Enough to fit Metropolitan France
};

export default Map;
