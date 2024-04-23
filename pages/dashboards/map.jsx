import React from 'react';

import useSWR from 'swr';
import { makeStyles } from 'tss-react/mui';

import AvailableTaxis from '@/components/AvailableTaxis';
import Map from '@/components/map/Map';
import {
  Circle,
  Marker,
  Popup,
  MapConsumer,
} from '@/components/map/MapComponents';
import TaxiMarker from '@/components/map/TaxiMarker';
import APIErrorAlert from '@/components/APIErrorAlert';
import { requestList } from '@/src/api';
import { UserContext } from '@/src/auth';
import { PARIS } from '@/src/utils';
import { Layout } from './index';

const useStyles = makeStyles()(() => ({
  errorIcon: {
    fontSize: '127px',
  },
}));

export default function DashboardMap() {
  const { classes } = useStyles();
  const userContext = React.useContext(UserContext);
  const [center, setCenter] = React.useState(PARIS);

  const errorIcon = {
    className: classes.errorIcon,
    html: '❌',
    iconSize: [128, 128],
  };

  const { data, error } = useSWR(
    ['/taxis', userContext.user.apikey, center],
    (url, token) => requestList(url, null, {
      token,
      args: {
        lat: center[0],
        lon: center[1],
      },
    }),
    { refreshInterval: 1000 },
  );

  const errorRef = React.useRef();

  // In case of error, force opening the popup to display the API error.
  React.useEffect(() => {
    errorRef.current?.openPopup();
  }, [error]);

  const mapHandlers = React.useMemo(
    () => ({
      moveend(e) {
        const latlng = e.target.getCenter();
        setCenter([latlng.lat, latlng.lng]);
      },
    }),
    [],
  );

  return (
    <Layout maxWidth="xl">
      <Map center={center} zoom={15}>
        <Circle center={center} radius={500} />
        <Circle center={center} radius={1} />
        {error && (
          <Marker
            position={center}
            icon={errorIcon}
            style={{ zIndex: '1!important' }}
            ref={errorRef}
          >
            <Popup>
              <APIErrorAlert error={error} />
            </Popup>
          </Marker>
        )}
        {data?.data.map((taxi) => <TaxiMarker taxi={taxi} key={taxi.id} />)}
        <MapConsumer eventsHandler={mapHandlers} />
      </Map>
      <AvailableTaxis center={center} />
    </Layout>
  );
}
