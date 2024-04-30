import React from 'react';
import useSWR from 'swr';

import dynamic from 'next/dynamic';
import LinearProgress from '@mui/material/LinearProgress';

import APIErrorAlert from '@/components/APIErrorAlert';
import Map from '@/components/map/Map';
import Station from '@/components/map/Station';
import { requestList } from '@/src/api';
import { UserContext } from '@/src/auth';
import { Layout } from './index';

export default function DashboardStations() {
  const userContext = React.useContext(UserContext);
  const { data, error } = useSWR(
    ['/stations/all', userContext.user.apikey],
    (url, token) => requestList(url, null, { token }),
  );

  // Couldn't be imported, dynamically or not, from MapComponents
  const MarkerClusterGroup = dynamic(
    () => import('@/components/map/ReactLeafletCluster'),
    { ssr: false },
  );

  return (
    <Layout maxWidth="xl">
      <p>
        Cette carte affiche les stations de taxi actuellement connues et intégrées dans le.taxi.
      </p>
      <p>Elle ne couvre pas encore l'ensemble des stations de France.</p>
      {error && <APIErrorAlert error={error} />}
      {!data && <LinearProgress />}
      <Map>
        <MarkerClusterGroup chunkedLoading removeOutsideVisibleBounds disableClusteringAtZoom={12}>
          {data?.data.map((station) => <Station key={station.id} station={station} />)}
        </MarkerClusterGroup>
      </Map>
    </Layout>
  );
}
