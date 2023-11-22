import dynamic from 'next/dynamic';
import React from 'react';
import useSWR from 'swr';

import LinearProgress from '@mui/material/LinearProgress';

import APIErrorAlert from '@/components/APIErrorAlert';
import { requestList } from '@/src/api';
import { UserContext } from '@/src/auth';
import { LYON } from '@/src/utils';
import { Layout } from './index';

export default function StatsHeatMap() {
  const userContext = React.useContext(UserContext);
  const { data: hailsData, error: hailsError } = useSWR(
    ['/stats/heatmap_hails', userContext.user.apikey],
    (url, token) => requestList(url, null, { token }),
  );
  const { data: taxisData, error: taxisError } = useSWR(
    ['/stats/heatmap_taxis', userContext.user.apikey],
    (url, token) => requestList(url, null, { token }),
  );

  const HeatMap = dynamic(
    () => import('@/components/HeatMap'),
    { ssr: false },
  );

  return (
    <Layout maxWidth="xl">
      <p>
        Cette carte affiche les points chauds de demandes prise en charge 🔵
        (abouties ou non) et des taxis en ligne 🟣.
      </p>
      {hailsError && <APIErrorAlert error={hailsError} />}
      {taxisError && <APIErrorAlert error={taxisError} />}
      {(!hailsData || !taxisData) && <LinearProgress />}
      {hailsData && taxisData && (
        <HeatMap
          hails={hailsData.data[0].points}
          taxis={taxisData.data[0].points}
          center={LYON}
          zoom={12}
        />
      )}
    </Layout>
  );
}
