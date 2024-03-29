import dynamic from 'next/dynamic';
import React from 'react';
import useSWR from 'swr';

import LinearProgress from '@mui/material/LinearProgress';

import APIErrorAlert from '@/components/APIErrorAlert';
import { requestList } from '@/src/api';
import { UserContext } from '@/src/auth';
import { Layout } from './index';

export default function DashboardZUPC() {
  const userContext = React.useContext(UserContext);
  const { data, error } = useSWR(
    ['/zupc/live', userContext.user.apikey],
    (url, token) => requestList(url, null, { token }),
  );

  const StatsMap = dynamic(
    () => import('@/components/StatsMap'),
    { ssr: false },
  );

  return (
    <Layout maxWidth="xl">
      <p>Cette carte affiche les <abbr title="Zone unique de prise en charge">ZUPC</abbr> actuellement connues et intégrées dans le.taxi.</p>
      <p>Elle ne couvre pas encore l'ensemble des ZUPC de France.</p>
      {error && <APIErrorAlert error={error} />}
      {!data && <LinearProgress />}
      {data && <StatsMap zupcs={data.data} />}
    </Layout>
  );
}
