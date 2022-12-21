import dynamic from 'next/dynamic';
import React from 'react';
import useSWR from 'swr';

import LinearProgress from '@mui/material/LinearProgress';

import APIErrorAlert from '@/components/APIErrorAlert';
import { requestList } from '@/src/api';
import { UserContext } from '@/src/auth';
import { Layout } from './index';

export default function DashboardStations() {
  const userContext = React.useContext(UserContext);
  const [filters, setFilters] = React.useState(
    () => JSON.parse(localStorage.getItem('statsFilters')) || { departements: [], insee: [] },
  );
  React.useEffect(() => {
    localStorage.setItem('statsFilters', JSON.stringify(filters));
  }, [filters]);

  const { data, error } = useSWR(
    [filters, '/stats/adsmap', userContext.user.apikey],
    (args, url, token) => requestList(url, null, { args, token }),
    { refreshInterval: 0 },
  );

  const Map = dynamic(
    () => import('@/components/StatsADSMap'),
    { ssr: false },
  );

  return (
    <Layout filters={filters} setFilters={setFilters} maxWidth="xl">
      <p>
        Cette carte affiche les taxis actuellement inscrits au registre.
      </p>
      <p>Le positionnement correspond à leur ADS et non à leur zone de prise en charge.</p>
      {error && <APIErrorAlert error={error} />}
      {!data && <LinearProgress />}
      {data && <Map departments={data.data} />}
    </Layout>
  );
}
