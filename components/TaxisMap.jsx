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

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { makeStyles } from 'tss-react/mui';

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

import APIErrorAlert from '@/components/APIErrorAlert';
import { formatLoc } from '@/src/utils';
import { requestList } from '@/src/api';
import SearchAddressDialog from '@/components/SearchAddressDialog';
import { UserContext } from '@/src/auth';

const PARIS = [48.86, 2.35];

const useStyles = makeStyles()((theme) => ({
  taxiIcon: {
    fontSize: '32px',
  },
  errorIcon: {
    fontSize: '127px',
  },
  mapButtons: {
    marginBottom: theme.spacing(1),

    '& > *': {
      marginRight: theme.spacing(1),
    },
  },
}));

/*
 * Display taxis on the map.
 */
function Taxis({ lon, lat }) {
  const { classes } = useStyles();
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
          <Circle
            center={taxi.position}
            radius={taxi.radius || 500}
            pathOptions={{ color: '#edd400' }}
          />
          <Popup>
            <dl>
              <dt>Taxi ID</dt>
              <dd>{taxi.id}</dd>

              <dt>Opérateur</dt>
              <dd>{taxi.operator}</dd>

              <dt>Statut</dt>
              <dd>{taxi.status}</dd>

              <dt>Rayon</dt>
              <dd>{taxi.radius ? (<>{taxi.radius} mètres</>) : (<i>par défaut</i>)}</dd>

              <dt>Longitude</dt>
              <dd>{formatLoc(taxi.position?.lon)}</dd>

              <dt>Latitude</dt>
              <dd>{formatLoc(taxi.position?.lat)}</dd>

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

  const statsOperators = (operators) => {
    if (!operators) {
      return null;
    }
    return (
      <span>, dont
        {Object.entries(operators).map(
          ([operator, num]) => (
            <span key={operator}>&nbsp;<strong>{num}</strong> taxis <i>{operator}</i></span>
          ),
        )}
      </span>
    );
  };

  return (
    <>
      {error && <APIErrorAlert error={error} />}

      <Box display="flex" justifyContent="flex-end" paddingRight={1}>
        {!error && !data && <p>...</p>}
        {
          data?.data.map((entry) => (entry.type === 'ZUPC' ? (
            <p key={entry.zupc_id}>
              <strong>{entry.stats.total}</strong> taxis connectés
              dans la ZUPC <strong>{entry.name}</strong>
              {statsOperators(entry.stats.operators)}
            </p>
          ) : (
            <p key={entry.insee}>
              <strong>{entry.stats.total}</strong> taxis connectés à <strong>{entry.name}</strong>
              {statsOperators(entry.stats.operators)}
            </p>
          )))
        }
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
  const initialCenter = map.getCenter();

  const [center, setCenter] = React.useState(
    [initialCenter.lat, initialCenter.lng],
  );

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
  const { classes } = useStyles();
  const [searchDialog, setSearchDialog] = React.useState(false);

  const mapboxTileLayer = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}';
  const [mapInstance, setMapInstance] = React.useState();

  const onSearch = (address) => {
    if (address) {
      const [lon, lat] = address.geometry.coordinates;
      mapInstance.flyTo([lat, lon], 15, { animate: true });
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
        center={PARIS}
        minZoom={5}
        maxZoom={16}
        zoom={15}
        style={{ height: 600, width: "100%" }}
        attributionControl={false}
        ref={setMapInstance}
      >
        <TileLayer
          url={mapboxTileLayer}
          accessToken={process.env.MAPBOX_TOKEN}
          id="mapbox/streets-v11"
        />
        <MapWidgets />
      </MapContainer>

      {mapInstance && <AvailableTaxis map={mapInstance} />}
      <SearchAddressDialog open={searchDialog} onClose={onSearch} />
    </div>
  );
}
