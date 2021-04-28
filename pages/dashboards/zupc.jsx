import React from 'react';

import dynamic from 'next/dynamic';

import useSWR from 'swr';

import APIErrorAlert from '../../components/APIErrorAlert';
import { Layout } from './index';
import { requestList } from '../../src/api';
import { UserContext } from '../../src/auth';

export default function DashboardZUPC() {
  const userContext = React.useContext(UserContext);
  const { data, error } = useSWR(
    ['/zupc/live', userContext.user.apikey],
    (url, token) => requestList(url, null, { token }),
  );

  const Map = dynamic(
    () => import('../../components/StatsMap'),
    { ssr: false },
  );

  return (
    <Layout>
      {error && <APIErrorAlert error={error} />}
      {data && <Map zupcs={data.data} />}
    </Layout>
  );
}
