import dynamic from 'next/dynamic';
import React from 'react';
import useSWR from 'swr';

import LinearProgress from '@material-ui/core/LinearProgress';

import APIErrorAlert from '@/components/APIErrorAlert';
import { requestList } from '@/src/api';
import { UserContext } from '@/src/auth';
import { Layout } from './index';

export default function DashboardStations() {
  const userContext = React.useContext(UserContext);
  const { data, error } = useSWR(
    ['/stations/all', userContext.user.apikey],
    (url, token) => requestList(url, null, { token }),
  );

  const Map = dynamic(
    () => import('@/components/StationsMap'),
    { ssr: false },
  );

  return (
    <Layout>
      <p>Cette carte affiche les stations de taxi actuellement connues et intégrées dans le.taxi.</p>
      <p>Elle ne couvre pas encore l'ensemble des stations de France.</p>
      {error && <APIErrorAlert error={error} />}
      {!data && <LinearProgress />}
      {data && <Map stations={data.data} />}
    </Layout>
  );
}
