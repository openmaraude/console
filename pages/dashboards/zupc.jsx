import React from 'react';
import useSWR from 'swr';

import LinearProgress from '@mui/material/LinearProgress';

import APIErrorAlert from '@/components/APIErrorAlert';
import Map from '@/components/map/Map';
import ZUPC from '@/components/map/ZUPC';
import { requestList } from '@/src/api';
import { UserContext } from '@/src/auth';
import { Layout } from './index';

export default function DashboardZUPC() {
  const userContext = React.useContext(UserContext);
  const { data, error } = useSWR(
    ['/zupc/live', userContext.user.apikey],
    (url, token) => requestList(url, null, { token }),
  );

  return (
    <Layout maxWidth="xl">
      <p>Cette carte affiche les <abbr title="Zone unique de prise en charge">ZUPC</abbr> actuellement connues et intégrées dans le.taxi.</p>
      <p>Elle ne couvre pas encore l'ensemble des ZUPC de France.</p>
      {error && <APIErrorAlert error={error} />}
      {!data && <LinearProgress />}
      <Map>
        {data?.data.map((zupc) => <ZUPC key={zupc.id} zupc={zupc} />)}
      </Map>
    </Layout>
  );
}
