import dynamic from 'next/dynamic';
import React from 'react';
import useSWR from 'swr';

import LinearProgress from '@mui/material/LinearProgress';

import APIErrorAlert from '@/components/APIErrorAlert';
import { requestList } from '@/src/api';
import { UserContext } from '@/src/auth';
import { LYON } from '@/src/utils';
import { Layout } from './index';

export default function HeatMap() {
  const userContext = React.useContext(UserContext);
  const { data, error } = useSWR(
    ['/stats/heatmap_hails', userContext.user.apikey],
    (url, token) => requestList(url, null, { token }),
    // { refreshInterval: 0 },
  );

  const Map = dynamic(
    () => import('@/components/HeatMap'),
    { ssr: false },
  );

  return (
    <Layout maxWidth="xl">
      <p>Cette carte affiche les points chauds de demandes prise en charge (abouties ou non).</p>
      {error && <APIErrorAlert error={error} />}
      {!data && <LinearProgress />}
      {data && <Map points={data.data[0].points} center={LYON} zoom={12} />}
    </Layout>
  );
}
