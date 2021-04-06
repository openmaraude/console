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

import useSWR from 'swr';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import { makeStyles } from '@material-ui/core/styles';

import L from 'leaflet';
import {
  Circle,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import APIErrorAlert from './APIErrorAlert';
import { requestList } from '../src/api';
import { UserContext } from '../src/auth';
import { formatDate } from '../src/utils';

const PARIS = [48.86, 2.35];

const useStyles = makeStyles(() => ({
  taxiIcon: {
    fontSize: '32px',
  },
  errorIcon: {
    fontSize: '127px',
  },
}));

/*
 * Display taxis on the map.
 */
function Taxis({ lon, lat }) {
  const classes = useStyles();
  const userContext = React.useContext(UserContext);

  const { data, error } = useSWR(
    ['/taxis', userContext.user.apikey, lon, lat],
    (url, token) => requestList(url, null, {
      token,
      args: {
        lon,
        lat,
      },
    }),
    { refreshInterval: 1000 },
  );

  const taxiIcon = new L.divIcon({
    className: classes.taxiIcon,
    html: '🚕',
    iconSize: [32, 32],
    iconAnchor: [32 / 2, 32],
  });

  const errorIcon = new L.divIcon({
    className: classes.errorIcon,
    html: '❌',
    iconSize: [128, 128],
  });

  const errorRef = React.useRef();

  // In case of error, force opening the popup to display the API error.
  React.useEffect(() => {
    errorRef.current?.openPopup();
  }, [error]);

  return (
    <>
      {error && (
        <Marker
          position={[lat, lon]}
          icon={errorIcon}
          ref={errorRef}
        >
          <Popup>
            <APIErrorAlert error={error} />
          </Popup>
        </Marker>
      )}
      {data?.data.map((taxi) => (
        <Marker
          key={taxi.id}
          position={[taxi.position?.lat, taxi.position?.lon]}
          icon={taxiIcon}
        >
          <Popup>
            <dl>
              <dt>Taxi ID</dt>
              <dd>{taxi.id}</dd>

              <dt>Opérateur</dt>
              <dd>{taxi.operator}</dd>

              <dt>Statut</dt>
              <dd>{taxi.status}</dd>

              <dt>Dernière géolocalisation</dt>
              <dd>{formatDate(new Date(taxi.last_update * 1000))}</dd>

              <dt>Longitude</dt>
              <dd>{taxi.position?.lon.toFixed(5)}</dd>

              <dt>Latitude</dt>
              <dd>{taxi.position?.lat.toFixed(5)}</dd>

              <dt>Distance par rapport au centre du cercle</dt>
              <dd>{taxi.crowfly_distance} mètres</dd>
            </dl>
          </Popup>
        </Marker>
      ))}
    </>
  );
}

Taxis.propTypes = {
  lon: PropTypes.number.isRequired,
  lat: PropTypes.number.isRequired,
};

/*
 * Display the number of available taxis in the ZUPC.
 */
function AvailableTaxis({ map }) {
  const userContext = React.useContext(UserContext);
  const [center, setCenter] = React.useState(map.getCenter());

  React.useEffect(() => {
    map.on('moveend', () => {
      setCenter(map.getCenter());
    });
  }, [map]);

  const { data, error } = useSWR(
    ['/zupc', userContext.user.apikey, center.lng, center.lat],
    (url, token) => requestList(url, null, {
      token,
      args: {
        lon: center.lng,
        lat: center.lat,
      },
    }),
    { refreshInterval: 5000 },
  );

  return (
    <>
      {error && <APIErrorAlert error={error} />}

      <Box display="flex" justifyContent="flex-end" paddingRight={1}>
        {!error && !data && <p>...</p>}
        {data?.data.map((zupc) => (
          <p key={zupc.zupc_id}>
            <strong>{zupc.nb_active}</strong> taxis connectés dans <strong>{zupc.nom}</strong>
          </p>
        ))}
      </Box>
    </>
  );
}

AvailableTaxis.propTypes = {
  map: PropTypes.shape({
    on: PropTypes.func,
    getCenter: PropTypes.func,
  }).isRequired,
};

/*
 * Widgets displayed on the map.
 */
function MapWidgets() {
  const map = useMap();

  // Default: middle of Paris.
  const [center, setCenter] = React.useState(PARIS);

  const onChange = () => {
    const newCenter = map.getCenter();
    setCenter([newCenter.lat, newCenter.lng]);
  };

  // Call onChange after zoom or move on the map.
  useMapEvents({
    moveend: onChange,
  });

  return (
    <>
      <Circle
        center={center}
        radius={500}
      />

      <Taxis lon={center[1]} lat={center[0]} />
    </>
  );
}

export default function TaxisMap() {
  const [open, setOpen] = React.useState(false);

  // We haven't changed this token for years. If you need to update the token
  // in the future, maybe you should consider setting it in process.env.
  const mapboxToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
  const mapboxTileLayer = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}';
  const [mapInstance, setMapInstance] = React.useState();

  const map = (
    <>
      <MapContainer
        center={PARIS}
        minZoom={5}
        maxZoom={16}
        zoom={15}
        style={{ height: open ? '90vh' : 600, width: "100%" }}
        attributionControl={false}
        whenCreated={setMapInstance}
      >
        <TileLayer
          url={mapboxTileLayer}
          accessToken={mapboxToken}
          id="mapbox/streets-v11"
        />
        <MapWidgets />
      </MapContainer>

      {mapInstance && <AvailableTaxis map={mapInstance} />}
    </>
  );

  if (open) {
    return (
      <Dialog
        fullWidth
        maxWidth="xl"
        open={open}
        onClose={() => setOpen(false)}
      >
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Fermer
          </Button>
        </DialogActions>
        {map}
      </Dialog>
    );
  }

  return (
    <div>
      <Box display="flex" justifyContent="flex-end">
        <Button color="primary" onClick={() => setOpen(true)}>
          Afficher en grand
        </Button>
      </Box>
      {map}
    </div>
  );
}